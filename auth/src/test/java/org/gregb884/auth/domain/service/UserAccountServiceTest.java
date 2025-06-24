package org.gregb884.auth.domain.service;

import org.gregb884.auth.application.dto.ResponseDto;
import org.gregb884.auth.application.port.in.UserDeleteUseCase;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.security.AuthenticatedUser;
import org.gregb884.auth.infrastructure.service.UserAccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserAccountServiceTest {

    private UserRepositoryPort userRepository;
    private AuthenticatedUser authenticatedUser;
    private UserDeleteUseCase userDeleteUseCase;
    private UserAccountService userAccountService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepositoryPort.class);
        authenticatedUser = mock(AuthenticatedUser.class);
        userDeleteUseCase = mock(UserDeleteUseCase.class);
        userAccountService = new UserAccountService(userRepository, authenticatedUser, userDeleteUseCase);
    }

    @Test
    void shouldReturnAccessWhenDateIsInFuture() {
        User user = new User();
        user.setReadyMadePlansAccess(Date.from(Instant.now().plusSeconds(3600)));

        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResponseDto response = userAccountService.readyPlansAccessCheck();
        assertThat(response.getResponse()).isEqualTo("Access");
    }

    @Test
    void shouldReturnAccessExpiredWhenDateInPast() {
        User user = new User();
        user.setReadyMadePlansAccess(Date.from(Instant.now().minusSeconds(3600)));

        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResponseDto response = userAccountService.readyPlansAccessCheck();
        assertThat(response.getResponse()).isEqualTo("Access expired");
    }

    @Test
    void shouldReturnAccessDeniedWhenDateIsNull() {
        User user = new User();
        user.setReadyMadePlansAccess(null);

        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResponseDto response = userAccountService.readyPlansAccessCheck();
        assertThat(response.getResponse()).isEqualTo("Access denied");
    }

    @Test
    void shouldReturnUserNotFoundWhenUserIsMissing() {
        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseDto response = userAccountService.readyPlansAccessCheck();
        assertThat(response.getResponse()).isEqualTo("User not found");
    }

    @Test
    void shouldReturnLoginCountAsString() {
        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.countLoginById(1L)).thenReturn(Optional.of(5));

        ResponseDto response = userAccountService.loginCount();
        assertThat(response.getResponse()).isEqualTo("5");
    }

    @Test
    void shouldReturnZeroWhenLoginCountNotFound() {
        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.countLoginById(1L)).thenReturn(Optional.empty());

        ResponseDto response = userAccountService.loginCount();
        assertThat(response.getResponse()).isEqualTo("0");
    }

    @Test
    void shouldDeleteUserAccount() {
        User user = new User();
        user.setId(1L);

        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResponseDto response = userAccountService.deleteMyAccount();

        verify(userDeleteUseCase).deleteUser(1L);
        assertThat(response.getResponse()).isEqualTo("Deleted");
    }

    @Test
    void shouldNotDeleteWhenUserNotFound() {
        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseDto response = userAccountService.deleteMyAccount();
        assertThat(response.getResponse()).isEqualTo("User not found");
    }

    @Test
    void shouldReturnSubscriptionDateWhenAvailable() {
        User user = new User();
        Date date = new Date();
        user.setReadyMadePlansAccess(date);

        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResponseDto response = userAccountService.subscriptionEndDate();
        assertThat(response.getResponse()).isEqualTo(date.toString());
    }

    @Test
    void shouldReturnNullWhenSubscriptionDateMissing() {
        User user = new User();
        user.setReadyMadePlansAccess(null);

        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResponseDto response = userAccountService.subscriptionEndDate();
        assertThat(response.getResponse()).isEqualTo("Null");
    }
}