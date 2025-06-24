package org.gregb884.auth.domain.service;

import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.service.ActivationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class ActivationServiceTest {

    private UserRepositoryPort userRepository;
    private ActivationService activationService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepositoryPort.class);
        activationService = new ActivationService(userRepository);
    }

    @Test
    void shouldActivateUserWhenTokenIsValid() {
        // given
        String token = "validToken";
        User user = new User();
        user.setVerified(false);

        when(userRepository.findByActivationToken(token)).thenReturn(Optional.of(user));

        // when
        boolean result = activationService.activateAccount(token);

        // then
        assertThat(result).isTrue();
        assertThat(user.isVerified()).isTrue();

        verify(userRepository).save(user);
    }

    @Test
    void shouldReturnFalseWhenTokenIsInvalid() {
        // given
        String token = "invalidToken";
        when(userRepository.findByActivationToken(token)).thenReturn(Optional.empty());

        // when
        boolean result = activationService.activateAccount(token);

        // then
        assertThat(result).isFalse();
        verify(userRepository, never()).save(any());
    }
}