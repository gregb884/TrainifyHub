package org.gregb884.auth.domain.service;

import com.google.api.services.androidpublisher.model.SubscriptionPurchase;
import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.gregb884.auth.application.dto.ResponseDto;
import org.gregb884.auth.application.port.out.GooglePurchaseVerifierPort;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.scheduler.SubscriptionReminderScheduler;
import org.gregb884.auth.infrastructure.security.AuthenticatedUser;
import org.gregb884.auth.infrastructure.service.UserDataService;
import org.gregb884.auth.infrastructure.service.UserSubscriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserSubscriptionServiceTest {

    private UserRepositoryPort userRepository;
    private AuthenticatedUser authenticatedUser;
    private SubscriptionReminderScheduler subscriptionReminderScheduler;
    private GooglePurchaseVerifierPort googlePurchaseVerifierPort;
    private UserDataService userDataService;

    private UserSubscriptionService userSubscriptionService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepositoryPort.class);
        authenticatedUser = mock(AuthenticatedUser.class);
        subscriptionReminderScheduler = mock(SubscriptionReminderScheduler.class);
        googlePurchaseVerifierPort = mock(GooglePurchaseVerifierPort.class);
        userDataService = mock(UserDataService.class);

        userSubscriptionService = new UserSubscriptionService(
                userRepository, authenticatedUser,
                subscriptionReminderScheduler,
                googlePurchaseVerifierPort,
                userDataService
        );

        when(authenticatedUser.getUserId()).thenReturn(1L);
        when(userDataService.getUserName()).thenReturn("testuser");
        when(userDataService.getLang()).thenReturn("en");
    }

    @Test
    void shouldReturnActiveIfPaymentStateIs1AndAcknowledged() throws Exception {
        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "prod", "token");
        SubscriptionPurchase sub = new SubscriptionPurchase();
        sub.setPaymentState(1);
        sub.setAcknowledgementState(0);
        sub.setExpiryTimeMillis(System.currentTimeMillis() + 1000000);

        when(googlePurchaseVerifierPort.verifySubscription(any(), any(), any())).thenReturn(sub);
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));

        ResponseDto response = userSubscriptionService.googleSubscriptionVerify(dto, "UTC");

        assertThat(response.getResponse()).isEqualTo("Subscription Active");
        verify(googlePurchaseVerifierPort).acknowledgeSubscription("pkg", "prod", "token");
        verify(subscriptionReminderScheduler).scheduleSubscriptionEndNotification(anyLong(), eq("UTC"), any(), any());
    }

    @Test
    void shouldReturnPendingIfPaymentStateIs2() throws Exception {
        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "prod", "token");
        SubscriptionPurchase sub = new SubscriptionPurchase();
        sub.setPaymentState(2);
        sub.setAcknowledgementState(0);

        when(googlePurchaseVerifierPort.verifySubscription(any(), any(), any())).thenReturn(sub);

        ResponseDto response = userSubscriptionService.googleSubscriptionVerify(dto, "UTC");

        assertThat(response.getResponse()).isEqualTo("Subscription Pending");
    }

    @Test
    void shouldReturnFailedIfPaymentStateIs0() throws Exception {
        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "prod", "token");
        SubscriptionPurchase sub = new SubscriptionPurchase();
        sub.setPaymentState(0);
        sub.setAcknowledgementState(0);

        when(googlePurchaseVerifierPort.verifySubscription(any(), any(), any())).thenReturn(sub);

        ResponseDto response = userSubscriptionService.googleSubscriptionVerify(dto, "UTC");

        assertThat(response.getResponse()).isEqualTo("Payment Failed or Pending");
    }

    @Test
    void shouldReturnRenewingIfExpiredButAutoRenewing() throws Exception {
        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "prod", "token");
        SubscriptionPurchase sub = new SubscriptionPurchase();
        sub.setPaymentState(3);
        sub.setAcknowledgementState(0);
        sub.setExpiryTimeMillis(System.currentTimeMillis() - 1000);
        sub.setAutoRenewing(true);

        when(googlePurchaseVerifierPort.verifySubscription(any(), any(), any())).thenReturn(sub);

        ResponseDto response = userSubscriptionService.googleSubscriptionVerify(dto, "UTC");

        assertThat(response.getResponse()).isEqualTo("Subscription Renewing");
    }

    @Test
    void shouldReturnErrorWhenExceptionThrown() throws Exception {
        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "prod", "token");

        when(googlePurchaseVerifierPort.verifySubscription(any(), any(), any())).thenThrow(new RuntimeException("boom"));

        ResponseDto response = userSubscriptionService.googleSubscriptionVerify(dto, "UTC");

        assertThat(response.getResponse()).contains("Error verifying subscription");
    }
}