package org.gregb884.auth.infrastructure.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.gregb884.auth.application.dto.ExternalLoginResponseDto;
import org.gregb884.auth.application.dto.UserDto;
import org.gregb884.auth.application.port.in.LoginUseCase;
import org.gregb884.auth.application.port.out.AppleTokenVerifierPort;
import org.gregb884.auth.application.port.out.TokenServicePort;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class UserLoginService implements LoginUseCase {

    private final UserRepositoryPort userRepository;
    private final TokenServicePort tokenServicePort;
    private final AppleTokenVerifierPort appleTokenVerifier;
    private final PasswordEncoder passwordEncoder;


    @Value("${google.clientid}")
    private String clientId;

    @Value("${google.clientIdIos}")
    private String clientIosId;

    public UserLoginService(UserRepositoryPort userRepository,
                            TokenServicePort tokenServicePort,
                            AppleTokenVerifierPort appleTokenVerifier,
                            @Value("${google.clientid}") String googleClientId,
                            @Value("${google.clientIdIos}") String googleClientIosId, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenServicePort = tokenServicePort;
        this.appleTokenVerifier = appleTokenVerifier;
        this.passwordEncoder = passwordEncoder;
    }



    @Override
    public String login(UserDto userDto) {

        User user = userRepository.findByUsername(userDto.getUsername()).orElse(null);
        if (user != null && passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            if (user.isBanned()) {
                return "Banned Account";
            }
            if (!user.isVerified()) {
                return "Account not active";
            }

            return tokenServicePort.generateToken(user);
        }

        return "Invalid username or password";
    }

    @Override
    public ExternalLoginResponseDto googleLogin(String token) {
        try {

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), JacksonFactory.getDefaultInstance()
            )
                    .setAudience(Arrays.asList(
                            clientId,
                            clientIosId
                    ))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();

                Optional<User> existingUser = userRepository.findByUsernameOptional(email);
                if (existingUser.isPresent()) {
                    User user = existingUser.get();
                    boolean isProfileComplete = (user.getLang() != null && user.getRole() != null);

                    if (isProfileComplete) {

                        String authenticateToken = tokenServicePort.generateToken(existingUser.get());

                        return new ExternalLoginResponseDto(authenticateToken,false,"");

                    }
                    else {

                        return new ExternalLoginResponseDto("",true,"");

                    }
                }

                User newUser = new User();
                newUser.setUsername(email);
                newUser.setGoogleAccount(true);
                userRepository.save(newUser);

                return new ExternalLoginResponseDto("",true,"");

            } else {
                return new ExternalLoginResponseDto("",false,"Invaild Google token");
            }
        } catch (Exception e) {
            return new ExternalLoginResponseDto("",false,"Google login error: " + e.getMessage());
        }
    }



    @Override
    public ExternalLoginResponseDto appleLogin(String token) {
        try {
            String email = appleTokenVerifier.verify(token);
            Optional<User> userOpt = userRepository.findByUsernameOptional(email);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getLang() != null && user.getRole() != null) {
                    return new ExternalLoginResponseDto(tokenServicePort.generateToken(user),false,"");
                } else {
                    return new ExternalLoginResponseDto("",true,"");
                }
            } else {
                User newUser = new User();
                newUser.setUsername(email);
                newUser.setAppleAccount(true);
                userRepository.save(newUser);
                return new ExternalLoginResponseDto("",true,"");
            }

        } catch (Exception e) {
            return new ExternalLoginResponseDto("",false,"Apple login error: " + e.getMessage());
        }
    }
}