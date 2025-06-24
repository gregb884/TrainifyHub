package org.gregb884.auth.application.port.in;

import com.google.api.services.androidpublisher.model.ProductPurchase;
import org.gregb884.auth.application.dto.ApplePurchaseResult;
import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.gregb884.auth.application.dto.ResponseDto;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface PurchaseUseCase {

    ResponseDto verifyGooglePurchase(PurchaseRequestDto dto);
    ApplePurchaseResult verifyApplePurchase(PurchaseRequestDto dto);
}