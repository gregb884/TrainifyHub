package org.gregb884.auth.controller;

import com.google.api.services.androidpublisher.model.ProductPurchase;
import com.google.api.services.androidpublisher.model.SubscriptionPurchase;
import org.gregb884.auth.dto.PurchaseRequestDto;
import org.gregb884.auth.service.GooglePlayService;
import org.gregb884.auth.service.SubscriptionReminderScheduler;
import org.gregb884.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/purchases")
public class GooglePlayController {

    private final GooglePlayService googlePlayService;
    private final UserService userService;
    private final SubscriptionReminderScheduler subscriptionReminderScheduler;

    public GooglePlayController(GooglePlayService googlePlayService, UserService userService, SubscriptionReminderScheduler subscriptionReminderScheduler) {
        this.googlePlayService = googlePlayService;
        this.userService = userService;
        this.subscriptionReminderScheduler = subscriptionReminderScheduler;
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPurchase(@RequestBody PurchaseRequestDto purchaseRequestDto) {
        try {

            ProductPurchase productPurchase = googlePlayService.verifyPurchase(purchaseRequestDto.getPackageName(), purchaseRequestDto.getProductId(), purchaseRequestDto.getPurchaseToken());

            if (productPurchase.getPurchaseState() == 1) {
                return ResponseEntity.ok("Confirm Payment");
            }

            if (productPurchase.getPurchaseState() == 0) {

                if (purchaseRequestDto.getProductId().equals("ai_custom_plan")){

                    if (userService.addOneAiCoin()){

                        googlePlayService.acknowledgePurchase(purchaseRequestDto.getPackageName(), purchaseRequestDto.getProductId(), purchaseRequestDto.getPurchaseToken());

                        return ResponseEntity.ok("Confirm Payment");
                    }
                }
            }

            return ResponseEntity.badRequest().body("❌ Error payment confirm ") ;
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("❌ Error payment confirm : " + e.getMessage()) ;
        }
    }



    @PostMapping("/verify-subscription")
    public ResponseEntity<String> verifySubscription(@RequestBody PurchaseRequestDto purchaseRequestDto,
                                                     @RequestParam String zone) {
        try {
            SubscriptionPurchase subscriptionPurchase = googlePlayService.verifySubscription(
                    purchaseRequestDto.getPackageName(),
                    purchaseRequestDto.getProductId(),
                    purchaseRequestDto.getPurchaseToken()
            );

            Integer paymentState = subscriptionPurchase.getPaymentState();
            Boolean autoRenewing = subscriptionPurchase.getAutoRenewing();
            Long expiryTimeMillis = subscriptionPurchase.getExpiryTimeMillis();
            Boolean acknowledged = subscriptionPurchase.getAcknowledgementState() == 1;

            if (paymentState == null) {
                return ResponseEntity.badRequest().body("❌ Error: paymentState is null");
            }

            if (paymentState == 1) {

               if (userService.changeTimeExpireSubscription(expiryTimeMillis,zone))

               {

                   if (!acknowledged) {
                       googlePlayService.acknowledgeSubscription(
                               purchaseRequestDto.getPackageName(),
                               purchaseRequestDto.getProductId(),
                               purchaseRequestDto.getPurchaseToken()
                       );
                   }

                   subscriptionReminderScheduler.scheduleSubscriptionEndNotification(expiryTimeMillis,zone, userService.getUserName(),userService.getLang());

                   return ResponseEntity.ok("Subscription Active");
               }

                return ResponseEntity.badRequest().body("❌ Renew Failed or Add Failed");

            }

            if (paymentState == 2) {  // 2 = Subskrypcja w oczekiwaniu (np. darmowy okres próbny)
                return ResponseEntity.ok("Subscription Pending");
            }

            if (paymentState == 0) {  // 0 = Płatność oczekuje (np. odrzucona karta)
                return ResponseEntity.badRequest().body("❌ Payment Failed or Pending");
            }

            if (expiryTimeMillis != null && expiryTimeMillis < System.currentTimeMillis() && autoRenewing) {
                return ResponseEntity.ok("Subscription Renewing");
            }



            return ResponseEntity.badRequest().body("❌ Unknown Subscription Status");

        } catch (IOException e) {
            return ResponseEntity.badRequest().body("❌ Error verifying subscription: " + e.getMessage());
        }
    }


    @PostMapping("/acknowledge")
    public String acknowledgePurchase(
            @RequestParam String packageName,
            @RequestParam String productId,
            @RequestParam String purchaseToken) {
        try {
            googlePlayService.acknowledgePurchase(packageName, productId, purchaseToken);
            System.out.println("✅ Zakup zweryfikowany!");
            return "✅ Zakup potwierdzony!";
        } catch (IOException e) {
            System.out.println("❌ Błąd podczas potwierdzania zakupu:");
            return "❌ Błąd podczas potwierdzania zakupu: " + e.getMessage();
        }
    }
}