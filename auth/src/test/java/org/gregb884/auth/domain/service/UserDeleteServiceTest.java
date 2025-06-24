package org.gregb884.auth.domain.service;

import org.gregb884.auth.application.port.out.ExternalUserModulePort;
import org.gregb884.auth.application.port.out.TokenServicePort;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.service.UserDeleteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserDeleteServiceTest {

    private ExternalUserModulePort externalUserModulePort;
    private UserRepositoryPort userRepository;
    private TokenServicePort tokenServicePort;
    private UserDeleteService userDeleteService;

    @BeforeEach
    void setUp() {
        externalUserModulePort = mock(ExternalUserModulePort.class);
        userRepository = mock(UserRepositoryPort.class);
        tokenServicePort = mock(TokenServicePort.class);
        userDeleteService = new UserDeleteService(externalUserModulePort, userRepository, tokenServicePort);
    }

    @Test
    void shouldDeleteUserSuccessfully() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(tokenServicePort.generateToken(user)).thenReturn("token");
        when(externalUserModulePort.deleteInAllModules(user, "token")).thenReturn(Collections.emptyList());

        String result = userDeleteService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
        assertThat(result).isEqualTo("Deleted user successfully");
    }

    @Test
    void shouldReturnErrorsIfExternalDeletionFails() {
        User user = new User();
        user.setId(2L);

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(tokenServicePort.generateToken(user)).thenReturn("token");
        when(externalUserModulePort.deleteInAllModules(user, "token")).thenReturn(List.of("Module A failed", "Module B failed"));

        String result = userDeleteService.deleteUser(2L);

        verify(userRepository, never()).deleteById(anyLong());
        assertThat(result).contains("Module A failed", "Module B failed");
    }

    @Test
    void shouldReturnMessageWhenUserNotFound() {
        when(userRepository.findById(3L)).thenReturn(Optional.empty());

        String result = userDeleteService.deleteUser(3L);

        verify(userRepository, never()).deleteById(anyLong());
        assertThat(result).isEqualTo("User not found");
    }
}