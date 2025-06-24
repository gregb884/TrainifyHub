package org.gregb884.auth.application.port.out;


import com.google.api.services.androidpublisher.model.ProductPurchase;
import com.google.api.services.androidpublisher.model.SubscriptionPurchase;
import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

@ConditionalOnProperty(name = "google.play.json")
public interface GooglePurchaseVerifierPort {


    ProductPurchase verifyPurchase(String packageName, String productId, String purchaseToken) throws IOException;

    SubscriptionPurchase verifySubscription(String packageName, String subscriptionId, String purchaseToken) throws IOException;

    void acknowledgeSubscription (String packageName, String productId, String purchaseToken) throws IOException;

    void acknowledgePurchase(String packageName, String productId, String purchaseToken) throws IOException;

}