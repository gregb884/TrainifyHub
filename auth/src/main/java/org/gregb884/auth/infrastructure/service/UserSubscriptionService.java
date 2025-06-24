package org.gregb884.auth.infrastructure.service;

import com.google.api.services.androidpublisher.model.SubscriptionPurchase;
import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.gregb884.auth.application.dto.ResponseDto;
import org.gregb884.auth.application.port.in.SubscriptionUseCase;
import org.gregb884.auth.application.port.out.GooglePurchaseVerifierPort;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.scheduler.SubscriptionReminderScheduler;
import org.gregb884.auth.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Optional;

@Service
public class UserSubscriptionService implements SubscriptionUseCase {

    private final UserRepositoryPort userRepository;
    private final AuthenticatedUser authenticatedUser;
    private final SubscriptionReminderScheduler subscriptionReminderScheduler;
    private final GooglePurchaseVerifierPort googlePurchaseVerifierPort;
    private final UserDataService userDataService;


    public UserSubscriptionService(UserRepositoryPort userRepository, AuthenticatedUser authenticatedUser, SubscriptionReminderScheduler subscriptionReminderScheduler, GooglePurchaseVerifierPort googlePurchaseVerifierPort, UserDataService userDataService) {
        this.userRepository = userRepository;
        this.authenticatedUser = authenticatedUser;
        this.subscriptionReminderScheduler = subscriptionReminderScheduler;
        this.googlePurchaseVerifierPort = googlePurchaseVerifierPort;
        this.userDataService = userDataService;
    }

    private Long getUserId() {
        return authenticatedUser.getUserId();
    }


    @Override
    public boolean changeTimeExpireSubscription(Long expiryTimeMillis, String zone) {
        try {
            Optional<User> user = userRepository.findById(getUserId());

            if (user.isPresent()) {
                Instant expiryInstant = Instant.ofEpochMilli(expiryTimeMillis);
                ZoneId zoneId = (zone != null && !zone.isEmpty()) ? ZoneId.of(zone) : ZoneId.of("UTC");
                ZonedDateTime expiryDateTime = expiryInstant.atZone(zoneId);
                Date expiryDate = Date.from(expiryDateTime.toInstant());

                user.get().setReadyMadePlansAccess(expiryDate);
                userRepository.save(user.get());

                return true;
            }
        } catch (Exception e) {
            return false;
        }

        return false;
    }

    @Override
    public ResponseDto googleSubscriptionVerify(PurchaseRequestDto purchaseRequestDto, String zone) {

        try {
            SubscriptionPurchase subscriptionPurchase = googlePurchaseVerifierPort.verifySubscription(
                    purchaseRequestDto.getPackageName(),
                    purchaseRequestDto.getProductId(),
                    purchaseRequestDto.getPurchaseToken()
            );

            Integer paymentState = subscriptionPurchase.getPaymentState();
            Boolean autoRenewing = subscriptionPurchase.getAutoRenewing();
            Long expiryTimeMillis = subscriptionPurchase.getExpiryTimeMillis();
            boolean acknowledged = subscriptionPurchase.getAcknowledgementState() != null &&
                    subscriptionPurchase.getAcknowledgementState() == 1;

            if (paymentState == null) {
                return new ResponseDto("Error: paymentState is null");
            }

            if (paymentState == 1) {

                if (changeTimeExpireSubscription(expiryTimeMillis,zone))

                {



                    if (!acknowledged) {
                        googlePurchaseVerifierPort.acknowledgeSubscription(
                                purchaseRequestDto.getPackageName(),
                                purchaseRequestDto.getProductId(),
                                purchaseRequestDto.getPurchaseToken()
                        );
                    }

                    subscriptionReminderScheduler.scheduleSubscriptionEndNotification(expiryTimeMillis,zone, userDataService.getUserName(),userDataService.getLang());

                    return new ResponseDto("Subscription Active");
                }

                return new ResponseDto("Renew Failed or Add Failed");

            }

            if (paymentState == 2) {  // 2 = Subskrypcja w oczekiwaniu (np. darmowy okres próbny)
                return new ResponseDto("Subscription Pending");
            }

            if (paymentState == 0) {  // 0 = Płatność oczekuje (np. odrzucona karta)
                return new ResponseDto("Payment Failed or Pending");
            }

            if (expiryTimeMillis != null && expiryTimeMillis < System.currentTimeMillis() && autoRenewing) {
                return new ResponseDto("Subscription Renewing");
            }

            return new ResponseDto("Unknown Subscription Status");

        } catch (Exception e) {
            return new ResponseDto("Error verifying subscription: " + e.getMessage());
        }


    }




}