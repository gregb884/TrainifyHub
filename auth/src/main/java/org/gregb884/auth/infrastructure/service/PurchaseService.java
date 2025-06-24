package org.gregb884.auth.infrastructure.service;

import com.google.api.services.androidpublisher.model.ProductPurchase;
import org.gregb884.auth.application.dto.ApplePurchaseResult;
import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.gregb884.auth.application.dto.ResponseDto;
import org.gregb884.auth.application.port.in.AiCoinUseCase;
import org.gregb884.auth.application.port.in.PurchaseUseCase;
import org.gregb884.auth.application.port.out.ApplePurchaseVerifierPort;
import org.gregb884.auth.application.port.out.GooglePurchaseVerifierPort;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@ConditionalOnProperty(name = "google.play.json")
public class PurchaseService implements PurchaseUseCase {

    private final ApplePurchaseVerifierPort applePurchaseVerifierPort;
    private final GooglePurchaseVerifierPort googlePurchaseVerifierPort;
    private final AiCoinUseCase aiCoinUseCase;



    public PurchaseService(ApplePurchaseVerifierPort applePurchaseVerifierPort, GooglePurchaseVerifierPort googlePurchaseVerifierPort, AiCoinUseCase aiCoinUseCase) {
        this.applePurchaseVerifierPort = applePurchaseVerifierPort;
        this.googlePurchaseVerifierPort = googlePurchaseVerifierPort;
        this.aiCoinUseCase = aiCoinUseCase;
    }

    @Override
    public ResponseDto verifyGooglePurchase(PurchaseRequestDto purchaseRequestDto) {

        try {

            ProductPurchase productPurchase = googlePurchaseVerifierPort.verifyPurchase(purchaseRequestDto.getPackageName(), purchaseRequestDto.getProductId(), purchaseRequestDto.getPurchaseToken());

            if (productPurchase.getPurchaseState() == 1) {

                return new ResponseDto("Confirm Payment");
            }

            if (productPurchase.getPurchaseState() == 0) {

                if (purchaseRequestDto.getProductId().equals("ai_custom_plan")){

                    if (aiCoinUseCase.addOneAiCoin()){

                        googlePurchaseVerifierPort.acknowledgePurchase(purchaseRequestDto.getPackageName(), purchaseRequestDto.getProductId(), purchaseRequestDto.getPurchaseToken());

                        return new ResponseDto("Confirm Payment");
                    }
                }
            }

            return new ResponseDto("❌ Error payment confirm");
        } catch (IOException e) {
            return new ResponseDto("❌ Error payment confirm : " + e.getMessage());
        }
    }

    @Override
    public ApplePurchaseResult verifyApplePurchase(PurchaseRequestDto dto) {

        return applePurchaseVerifierPort.verify(dto.getPurchaseToken());

    }


}