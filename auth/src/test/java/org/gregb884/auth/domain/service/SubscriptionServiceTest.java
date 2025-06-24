package org.gregb884.auth.domain.service;

import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.security.AuthenticatedUser;
import org.gregb884.auth.infrastructure.service.SubscriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class SubscriptionServiceTest {

    private UserRepositoryPort userRepository;
    private AuthenticatedUser authenticatedUser;
    private SubscriptionService subscriptionService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepositoryPort.class);
        authenticatedUser = mock(AuthenticatedUser.class);
        subscriptionService = new SubscriptionService(userRepository, authenticatedUser);
    }

    @Test
    void shouldUpdateSubscriptionDateWithZone() {
        Long expiryMillis = Instant.now().plusSeconds(3600).toEpochMilli();
        String zone = "Europe/Warsaw";

        User user = new User();
        when(authenticatedUser.getUserId()).thenReturn(123L);
        when(userRepository.findById(123L)).thenReturn(Optional.of(user));

        boolean result = subscriptionService.changeTimeExpireSubscription(expiryMillis, zone);

        assertThat(result).isTrue();
        assertThat(user.getReadyMadePlansAccess()).isNotNull();
        verify(userRepository).save(user);
    }

    @Test
    void shouldUpdateSubscriptionDateWithDefaultZoneWhenZoneIsNull() {
        Long expiryMillis = Instant.now().plusSeconds(3600).toEpochMilli();
        String zone = null;

        User user = new User();
        when(authenticatedUser.getUserId()).thenReturn(123L);
        when(userRepository.findById(123L)).thenReturn(Optional.of(user));

        boolean result = subscriptionService.changeTimeExpireSubscription(expiryMillis, zone);

        assertThat(result).isTrue();
        assertThat(user.getReadyMadePlansAccess()).isNotNull();
        verify(userRepository).save(user);
    }

    @Test
    void shouldReturnFalseWhenUserNotFound() {
        when(authenticatedUser.getUserId()).thenReturn(123L);
        when(userRepository.findById(123L)).thenReturn(Optional.empty());

        boolean result = subscriptionService.changeTimeExpireSubscription(123456789L, "Europe/Warsaw");

        assertThat(result).isFalse();
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldReturnFalseWhenExceptionIsThrown() {
        when(authenticatedUser.getUserId()).thenThrow(new RuntimeException("DB is down"));

        boolean result = subscriptionService.changeTimeExpireSubscription(123456789L, "Europe/Warsaw");

        assertThat(result).isFalse();
    }
}