package org.gregb884.auth.infrastructure.adapter.in.controller;

import org.gregb884.auth.application.dto.ApplePurchaseResult;
import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.gregb884.auth.application.port.in.PurchaseUseCase;
import org.gregb884.auth.application.port.out.ApplePurchaseVerifierPort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchasesIos")
public class AppleStoreController {

    private final PurchaseUseCase purchaseUseCase;

    public AppleStoreController(PurchaseUseCase purchaseUseCase) {
        this.purchaseUseCase = purchaseUseCase;
    }


    @PostMapping("/verify-purchase")
    public ResponseEntity<?> verifyOneTimePurchase(@RequestBody PurchaseRequestDto purchaseRequestDto) {
        String receipt = purchaseRequestDto.getPurchaseToken();

        if (receipt == null || receipt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Error : missing receipt");
        }

        ApplePurchaseResult applePurchaseResult = purchaseUseCase.verifyApplePurchase(purchaseRequestDto);

        if (applePurchaseResult.isSuccess()){

            return ResponseEntity.ok("Confirm Payment");
        }

        if (applePurchaseResult.isSubscription()){

            return ResponseEntity.ok("Confirm Sub");
        }

        if (!applePurchaseResult.getErrorMessage().isEmpty() && !applePurchaseResult.getErrorMessage().isBlank()){

            return ResponseEntity.badRequest().body(applePurchaseResult.getErrorMessage());
        }

        return ResponseEntity.badRequest().build();

    }


}