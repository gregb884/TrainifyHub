package org.gregb884.auth.infrastructure.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.gregb884.auth.application.dto.RegisterUserResultDto;
import org.gregb884.auth.application.dto.ResponseFromOtherModuleDto;
import org.gregb884.auth.application.dto.UserDto;
import org.gregb884.auth.application.dto.UserDtoForCreateInOtherModule;
import org.gregb884.auth.application.port.in.RegisterUserUseCase;
import org.gregb884.auth.application.port.out.AppleTokenVerifierPort;
import org.gregb884.auth.application.port.out.EmailServicePort;
import org.gregb884.auth.application.port.out.ExternalUserModulePort;
import org.gregb884.auth.application.port.out.TokenServicePort;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserRegistrationService implements RegisterUserUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenServicePort tokenServicePort;
    private final EmailServicePort emailServicePort;
    private final ExternalUserModulePort externalUserModulePort;
    private final AppleTokenVerifierPort appleTokenVerifierPort;

    @Value("${google.clientid}") String googleClientId;
    @Value("${google.clientIdIos}") String appleClientId;

    public UserRegistrationService(UserRepositoryPort userRepository,
                                   PasswordEncoder passwordEncoder,
                                   TokenServicePort tokenService,
                                   EmailServicePort emailService,
                                   ExternalUserModulePort externalUserModulePort, AppleTokenVerifierPort appleTokenVerifierPort) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenServicePort = tokenService;
        this.emailServicePort = emailService;
        this.externalUserModulePort = externalUserModulePort;
        this.appleTokenVerifierPort = appleTokenVerifierPort;
    }

    @Override
    public RegisterUserResultDto registerUser(UserDto userDto) {
        if (!isValidLang(userDto.getLang())) {

            return new RegisterUserResultDto(false,"Invalid language");
        }

        if (!isValidRole(userDto.getRole())) {
            return new RegisterUserResultDto(false,"Invalid role");
        }

        if (userRepository.existsUserByUsername(userDto.getUsername())) {
            return new RegisterUserResultDto(false,"Username already exists");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setLang(userDto.getLang());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(userDto.getRole());
        user.setBanned(false);
        user.setActivationToken(UUID.randomUUID().toString());

        userRepository.save(user);

        String token = tokenServicePort.generateToken(user);
        UserDtoForCreateInOtherModule dto = new UserDtoForCreateInOtherModule();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRegion(user.getLang());

        ResponseFromOtherModuleDto syncResult = externalUserModulePort.saveInOtherModules(dto, user, userDto, token);

        if (!syncResult.getResponse().equals("Success")) {
            return new RegisterUserResultDto(false,syncResult.getResponse());
        }

        try {
            String subject = "Activation";
            String body = "Activate your account here: https://www.trainifyhub.com/login?token=" + user.getActivationToken();
            emailServicePort.sendEmail(user.getUsername(), subject, body);
        } catch (Exception e) {
            List<String> errors = externalUserModulePort.deleteInAllModules(user, token);

            if (errors.isEmpty()) {
                userRepository.deleteById(user.getId());
            }

            return new RegisterUserResultDto(false,"Email error");
        }

        return new RegisterUserResultDto(true,"Created user '" + userDto.getUsername() + "' successfully");
    }

    private boolean isValidLang(String lang) {
        return lang != null && (lang.equals("pl") || lang.equals("en") || lang.equals("de"));
    }

    private boolean isValidRole(String role) {
        return role != null && (role.equals("TRAINER") || role.equals("USER"));
    }

    @Override
    public RegisterUserResultDto fillNewUserData(String token, UserDto userDto) {

        if (userDto.getLang() == null ||
                userDto.getLang().isEmpty() ||
                !(userDto.getLang().equals("en") ||
                        userDto.getLang().equals("pl") ||
                        userDto.getLang().equals("de"))) {


            return new RegisterUserResultDto(false,"Not a valid language");

        }

        if (userDto.getRole() == null ||
                userDto.getRole().isEmpty() ||
                !(userDto.getRole().equals("TRAINER") ||
                        userDto.getRole().equals("USER"))) {

            return new RegisterUserResultDto(false,"Not a valid role");
        }

        try {

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), JacksonFactory.getDefaultInstance()
            )
                    .setAudience(Arrays.asList(
                            googleClientId,
                            appleClientId
                    ))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();

                return processExternalUser(email,userDto);

            } else {

                throw new Exception("Token Google is Null");
            }

        }catch (Exception e){

            try {

                String emailFromApple = appleTokenVerifierPort.verify(token);


                if (emailFromApple != null) {

                   return processExternalUser(emailFromApple,userDto);

                } else {

                    return new RegisterUserResultDto(false,"Token is Null");
                }


            } catch (Exception exceptionApple){

                return new RegisterUserResultDto(false,exceptionApple.getMessage());

            }

        }

    }


    private RegisterUserResultDto processExternalUser(String email, UserDto userDto) {
        Optional<User> existingUser = userRepository.findByUsernameOptional(email);

        if (existingUser.isEmpty()) {
            return new RegisterUserResultDto(false, "User not found");
        }

        User user = existingUser.get();
        user.setRole(userDto.getRole());
        user.setLang(userDto.getLang());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setVerified(true);
        user.setLoginCount(0);

        userRepository.save(user);

        String authenticateToken = tokenServicePort.generateToken(user);

        UserDtoForCreateInOtherModule externalDto = new UserDtoForCreateInOtherModule();
        externalDto.setUsername(user.getUsername());
        externalDto.setId(user.getId());
        externalDto.setFirstName(user.getFirstName());
        externalDto.setLastName(user.getLastName());
        externalDto.setRegion(user.getLang());

        ResponseFromOtherModuleDto response = externalUserModulePort.saveInOtherModules(externalDto, user, userDto, authenticateToken);

        if ("Success".equals(response.getResponse())) {
            return new RegisterUserResultDto(true, authenticateToken);
        }

        return new RegisterUserResultDto(false, response.getResponse());
    }

}