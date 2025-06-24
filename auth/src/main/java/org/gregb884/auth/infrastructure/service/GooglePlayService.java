package org.gregb884.auth.infrastructure.service;

import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.androidpublisher.AndroidPublisher;
import com.google.api.services.androidpublisher.AndroidPublisherScopes;
import com.google.api.services.androidpublisher.model.ProductPurchase;
import com.google.api.services.androidpublisher.model.SubscriptionPurchase;
import com.google.api.services.androidpublisher.model.SubscriptionPurchasesAcknowledgeRequest;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.gregb884.auth.application.port.out.GooglePurchaseVerifierPort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Service
@ConditionalOnProperty(name = "google.play.json")
public class GooglePlayService implements GooglePurchaseVerifierPort {

    private final AndroidPublisher androidPublisher;

    //constructor for tests
    public GooglePlayService(AndroidPublisher androidPublisher) {
        this.androidPublisher = androidPublisher;
    }

    @Autowired
    public GooglePlayService(@Value("${google.play.json:}") String googlePlayJson) throws IOException {

        if (googlePlayJson.isBlank()) {
            throw new RuntimeException("❌ GOOGLE_PLAY_JSON not set");
        }

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new ByteArrayInputStream(googlePlayJson.getBytes(StandardCharsets.UTF_8)))
                .createScoped(Collections.singleton(AndroidPublisherScopes.ANDROIDPUBLISHER));

        androidPublisher = new AndroidPublisher.Builder(
                new com.google.api.client.http.javanet.NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials)
        ).setApplicationName("TrainifyHubBackend").build();

    }


    public ProductPurchase verifyPurchase(String packageName, String productId, String purchaseToken) throws IOException {
        return androidPublisher.purchases().products().get(packageName, productId, purchaseToken).execute();
    }

    public SubscriptionPurchase verifySubscription(String packageName, String subscriptionId, String purchaseToken) throws IOException {
        return androidPublisher.purchases().subscriptions().get(packageName, subscriptionId, purchaseToken).execute();
    }

    public void acknowledgePurchase(String packageName, String productId, String purchaseToken) throws IOException {
        androidPublisher.purchases().products().acknowledge(packageName, productId, purchaseToken, null).execute();
    }

    public void acknowledgeSubscription(String packageName, String subscriptionId, String purchaseToken) throws IOException {
        androidPublisher.purchases().subscriptions()
                .acknowledge(packageName, subscriptionId, purchaseToken, new SubscriptionPurchasesAcknowledgeRequest())
                .execute();
    }

}