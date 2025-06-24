package org.gregb884.auth.application.port.out;

import org.gregb884.auth.application.dto.ApplePurchaseResult;
import org.springframework.http.ResponseEntity;

public interface ApplePurchaseVerifierPort {

    ApplePurchaseResult verify(String receipt);
}