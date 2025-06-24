package org.gregb884.auth.application.port.in;

import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.gregb884.auth.application.dto.ResponseDto;
import org.springframework.http.ResponseEntity;

public interface SubscriptionUseCase {
    boolean changeTimeExpireSubscription(Long expiryTimeMillis, String zone);
    ResponseDto googleSubscriptionVerify(PurchaseRequestDto purchaseRequestDto, String zone);
}