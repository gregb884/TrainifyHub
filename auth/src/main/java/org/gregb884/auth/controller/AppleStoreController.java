package org.gregb884.auth.controller;


import org.gregb884.auth.dto.PurchaseRequestDto;
import org.gregb884.auth.service.AppleStoreService;
import org.gregb884.auth.service.UserService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/purchasesIos")
public class AppleStoreController {

    private final AppleStoreService appleStoreService;

    public AppleStoreController(AppleStoreService appleStoreService, UserService userService) {
        this.appleStoreService = appleStoreService;
    }


    @PostMapping("/verify-purchase")
    public ResponseEntity<?> verifyOneTimePurchase(@RequestBody PurchaseRequestDto purchaseRequestDto) {
        String receipt = purchaseRequestDto.getPurchaseToken();

        if (receipt == null || receipt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Error : missing receipt");
        }

        return appleStoreService.verifyPayment(receipt);

    }


}
