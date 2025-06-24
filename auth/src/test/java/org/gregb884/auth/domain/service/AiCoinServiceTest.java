package org.gregb884.auth.domain.service;

import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.security.AuthenticatedUser;
import org.gregb884.auth.infrastructure.service.AiCoinService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class AiCoinServiceTest {

    private UserRepositoryPort userRepository;
    private AuthenticatedUser authenticatedUser;
    private AiCoinService aiCoinService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepositoryPort.class);
        authenticatedUser = mock(AuthenticatedUser.class);
        aiCoinService = new AiCoinService(userRepository, authenticatedUser);

        when(authenticatedUser.getUserId()).thenReturn(1L);
    }

    @Test
    void shouldReturnZeroIfUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Integer coins = aiCoinService.checkAiCoins();

        assertThat(coins).isEqualTo(0);
    }

    @Test
    void shouldReturnZeroIfCoinsAreNull() {
        User user = new User();
        user.setAiCoins(null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Integer coins = aiCoinService.checkAiCoins();

        assertThat(coins).isEqualTo(0);
    }

    @Test
    void shouldReturnCorrectCoinValue() {
        User user = new User();
        user.setAiCoins(5);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Integer coins = aiCoinService.checkAiCoins();

        assertThat(coins).isEqualTo(5);
    }

    @Test
    void shouldConsumeAiCoinIfUserHasCoins() {
        User user = new User();
        user.setAiCoins(3);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        boolean result = aiCoinService.consumeAiCoin();

        assertThat(result).isTrue();
        assertThat(user.getAiCoins()).isEqualTo(2);
        verify(userRepository).save(user);
    }

    @Test
    void shouldNotConsumeAiCoinIfUserHasZeroCoins() {
        User user = new User();
        user.setAiCoins(0);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        boolean result = aiCoinService.consumeAiCoin();

        assertThat(result).isFalse();
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldAddOneCoinEvenIfNull() {
        User user = new User();
        user.setAiCoins(null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        boolean result = aiCoinService.addOneAiCoin();

        assertThat(result).isTrue();
        assertThat(user.getAiCoins()).isEqualTo(1);
        verify(userRepository).save(user);
    }

    @Test
    void shouldAddOneCoinIfValueExists() {
        User user = new User();
        user.setAiCoins(2);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        boolean result = aiCoinService.addOneAiCoin();

        assertThat(result).isTrue();
        assertThat(user.getAiCoins()).isEqualTo(3);
        verify(userRepository).save(user);
    }
}