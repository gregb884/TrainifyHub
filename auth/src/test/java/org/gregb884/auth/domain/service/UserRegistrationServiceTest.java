package org.gregb884.auth.domain.service;

import org.gregb884.auth.application.dto.RegisterUserResultDto;
import org.gregb884.auth.application.dto.ResponseFromOtherModuleDto;
import org.gregb884.auth.application.dto.UserDto;
import org.gregb884.auth.application.port.out.AppleTokenVerifierPort;
import org.gregb884.auth.application.port.out.EmailServicePort;
import org.gregb884.auth.application.port.out.ExternalUserModulePort;
import org.gregb884.auth.application.port.out.TokenServicePort;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.service.UserRegistrationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserRegistrationServiceTest {

    private UserRepositoryPort userRepository;
    private PasswordEncoder passwordEncoder;
    private TokenServicePort tokenServicePort;
    private EmailServicePort emailServicePort;
    private ExternalUserModulePort externalUserModulePort;
    private AppleTokenVerifierPort appleTokenVerifierPort;
    private UserRegistrationService userRegistrationService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepositoryPort.class);
        passwordEncoder = mock(PasswordEncoder.class);
        tokenServicePort = mock(TokenServicePort.class);
        emailServicePort = mock(EmailServicePort.class);
        externalUserModulePort = mock(ExternalUserModulePort.class);
        appleTokenVerifierPort = mock(AppleTokenVerifierPort.class);

        userRegistrationService = new UserRegistrationService(
                userRepository,
                passwordEncoder,
                tokenServicePort,
                emailServicePort,
                externalUserModulePort,
                appleTokenVerifierPort
        );
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        UserDto userDto = new UserDto();
        userDto.setUsername("test@example.com");
        userDto.setPassword("pass");
        userDto.setFirstName("John");
        userDto.setLastName("Doe");
        userDto.setLang("en");
        userDto.setRole("USER");

        when(userRepository.existsUserByUsername(userDto.getUsername())).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("encoded-pass");
        when(tokenServicePort.generateToken(any())).thenReturn("token");
        when(externalUserModulePort.saveInOtherModules(any(), any(), eq(userDto), any()))
                .thenReturn(new ResponseFromOtherModuleDto("Success"));

        RegisterUserResultDto result = userRegistrationService.registerUser(userDto);

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.getMessage()).contains("Created user");
        verify(userRepository).save(any(User.class));
        verify(emailServicePort).sendEmail(eq("test@example.com"), anyString(), contains("Activate your account"));
    }

    @Test
    void shouldReturnErrorIfLangInvalid() {

        UserDto userDto = new UserDto();
        userDto.setUsername("email");
        userDto.setPassword("pass");
        userDto.setFirstName("a");
        userDto.setLastName("b");
        userDto.setLang("xx");
        userDto.setRole("USER");

        RegisterUserResultDto result = userRegistrationService.registerUser(userDto);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).isEqualTo("Invalid language");
    }

    @Test
    void shouldReturnErrorIfRoleInvalid() {

        UserDto userDto = new UserDto();
        userDto.setUsername("email");
        userDto.setPassword("pass");
        userDto.setFirstName("a");
        userDto.setLastName("b");
        userDto.setLang("en");
        userDto.setRole("INVAILD");


        RegisterUserResultDto result = userRegistrationService.registerUser(userDto);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).isEqualTo("Invalid role");
    }

    @Test
    void shouldReturnErrorIfUsernameExists() {

        UserDto userDto = new UserDto();
        userDto.setUsername("email");
        userDto.setPassword("pass");
        userDto.setFirstName("a");
        userDto.setLastName("b");
        userDto.setLang("en");
        userDto.setRole("USER");

        when(userRepository.existsUserByUsername("email")).thenReturn(true);

        RegisterUserResultDto result = userRegistrationService.registerUser(userDto);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).isEqualTo("Username already exists");
    }

    @Test
    void shouldHandleEmailSendingFailureAndCleanupUser() {

        UserDto userDto = new UserDto();
        userDto.setUsername("email");
        userDto.setPassword("pass");
        userDto.setFirstName("a");
        userDto.setLastName("b");
        userDto.setLang("en");
        userDto.setRole("USER");

        when(userRepository.existsUserByUsername("email")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("enc");
        when(tokenServicePort.generateToken(any())).thenReturn("token");
        when(externalUserModulePort.saveInOtherModules(any(), any(), eq(userDto), any()))
                .thenReturn(new ResponseFromOtherModuleDto("Success"));

        doThrow(new RuntimeException("email fail")).when(emailServicePort).sendEmail(any(), any(), any());

        RegisterUserResultDto result = userRegistrationService.registerUser(userDto);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).isEqualTo("Email error");
        verify(externalUserModulePort).deleteInAllModules(any(), any());
        verify(userRepository).deleteById(any());
    }

    @Test
    void shouldReturnErrorWhenExternalModuleFails() {

        UserDto userDto = new UserDto();
        userDto.setUsername("email");
        userDto.setPassword("pass");
        userDto.setFirstName("a");
        userDto.setLastName("b");
        userDto.setLang("en");
        userDto.setRole("USER");

        when(userRepository.existsUserByUsername("email")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("enc");
        when(tokenServicePort.generateToken(any())).thenReturn("token");

        when(externalUserModulePort.saveInOtherModules(any(), any(), eq(userDto), any()))
                .thenReturn(new ResponseFromOtherModuleDto("Failure"));

        RegisterUserResultDto result = userRegistrationService.registerUser(userDto);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).isEqualTo("Failure");
    }

    @Test
    void shouldFillNewUserDataSuccessfullyWithAppleFallback() throws Exception {
        User existing = new User();
        existing.setUsername("user@example.com");

        UserDto userDto = new UserDto();
        userDto.setUsername("user@example.com");
        userDto.setPassword("");
        userDto.setFirstName("John");
        userDto.setLastName("Doe");
        userDto.setLang("pl");
        userDto.setRole("USER");

        when(appleTokenVerifierPort.verify("token")).thenReturn("user@example.com");
        when(userRepository.findByUsernameOptional("user@example.com")).thenReturn(Optional.of(existing));
        when(tokenServicePort.generateToken(existing)).thenReturn("jwt");
        when(externalUserModulePort.saveInOtherModules(any(), eq(existing), eq(userDto), any()))
                .thenReturn(new ResponseFromOtherModuleDto("Success"));

        RegisterUserResultDto result = userRegistrationService.fillNewUserData("token", userDto);

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.getMessage()).isEqualTo("jwt");
    }

    @Test
    void shouldReturnErrorWhenAppleFailsCompletely() throws Exception {

        UserDto userDto = new UserDto();
        userDto.setUsername("user@example.com");
        userDto.setPassword("");
        userDto.setFirstName("John");
        userDto.setLastName("Doe");
        userDto.setLang("en");
        userDto.setRole("USER");

        when(appleTokenVerifierPort.verify("token")).thenThrow(new RuntimeException("boom"));

        RegisterUserResultDto result = userRegistrationService.fillNewUserData("token", userDto);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getMessage()).contains("boom");
    }

    @Test
    void shouldRejectInvalidLangOrRoleOnFill() {

        UserDto userDto = new UserDto();
        userDto.setUsername("u");
        userDto.setPassword("");
        userDto.setFirstName("J");
        userDto.setLastName("");
        userDto.setLang("fr");
        userDto.setRole("USER");

        RegisterUserResultDto result1 = userRegistrationService.fillNewUserData("token", userDto);
        assertThat(result1.isSuccess()).isFalse();


        UserDto badRole = new UserDto();
        badRole.setUsername("u");
        badRole.setPassword("");
        badRole.setFirstName("");
        badRole.setLastName("");
        badRole.setLang("en");
        badRole.setRole("INVALID");


        RegisterUserResultDto result2 = userRegistrationService.fillNewUserData("token", badRole);
        assertThat(result2.isSuccess()).isFalse();
    }
}