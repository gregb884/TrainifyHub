package org.gregb884.auth.infrastructure.adapter.in.controller;

import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.gregb884.auth.application.dto.ResponseDto;
import org.gregb884.auth.application.port.in.AiCoinUseCase;
import org.gregb884.auth.application.port.in.PurchaseUseCase;
import org.gregb884.auth.application.port.in.SubscriptionUseCase;
import org.gregb884.auth.application.port.in.UserAccountUseCase;
import org.gregb884.auth.application.port.out.GooglePurchaseVerifierPort;
import org.gregb884.auth.infrastructure.service.UserDataService;
import org.gregb884.auth.infrastructure.scheduler.SubscriptionReminderScheduler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/purchases")
public class GooglePlayController {


    private final GooglePurchaseVerifierPort googlePurchaseVerifierPort;
    private final AiCoinUseCase aiCoinUseCase;
    private final SubscriptionUseCase subscriptionUseCase;
    private final PurchaseUseCase purchaseUseCase;
    private final SubscriptionReminderScheduler subscriptionReminderScheduler;
    private final UserAccountUseCase userAccountUseCase;
    private final UserDataService userDataService;

    public GooglePlayController(GooglePurchaseVerifierPort googlePurchaseVerifierPort, AiCoinUseCase aiCoinUseCase, SubscriptionUseCase subscriptionUseCase, PurchaseUseCase purchaseUseCase, SubscriptionReminderScheduler subscriptionReminderScheduler, UserAccountUseCase userAccountUseCase, UserDataService userDataService) {
        this.googlePurchaseVerifierPort = googlePurchaseVerifierPort;
        this.aiCoinUseCase = aiCoinUseCase;
        this.subscriptionUseCase = subscriptionUseCase;
        this.purchaseUseCase = purchaseUseCase;
        this.subscriptionReminderScheduler = subscriptionReminderScheduler;
        this.userAccountUseCase = userAccountUseCase;
        this.userDataService = userDataService;
    }


    @PostMapping("/verify")
    public ResponseEntity<String> verifyPurchase(@RequestBody PurchaseRequestDto purchaseRequestDto) {

        ResponseDto responseDto = purchaseUseCase.verifyGooglePurchase(purchaseRequestDto);

        if (responseDto.getResponse().equals("Confirm Payment")) {
            return ResponseEntity.ok(responseDto.getResponse());
        } else return ResponseEntity.badRequest().body(responseDto.getResponse());


    }



    @PostMapping("/verify-subscription")
    public ResponseEntity<String> verifySubscription(@RequestBody PurchaseRequestDto purchaseRequestDto,
                                                     @RequestParam String zone) {

        ResponseDto responseDto = subscriptionUseCase.googleSubscriptionVerify(purchaseRequestDto, zone);

        if (responseDto.getResponse().equals("Subscription Pending") ||
                responseDto.getResponse().equals("Subscription Active") ||
                responseDto.getResponse().equals("Subscription Renewing")) {

            return ResponseEntity.ok(responseDto.getResponse());

        } else return ResponseEntity.badRequest().body(responseDto.getResponse());

    }


    @PostMapping("/acknowledge")
    public String acknowledgePurchase(
            @RequestParam String packageName,
            @RequestParam String productId,
            @RequestParam String purchaseToken) {
        try {
            googlePurchaseVerifierPort.acknowledgePurchase(packageName, productId, purchaseToken);
            System.out.println("✅ Zakup zweryfikowany!");
            return "✅ Zakup potwierdzony!";
        } catch (IOException e) {
            System.out.println("❌ Błąd podczas potwierdzania zakupu:");
            return "❌ Błąd podczas potwierdzania zakupu: " + e.getMessage();
        }
    }
}