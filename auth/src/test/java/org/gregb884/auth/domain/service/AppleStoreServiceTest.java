package org.gregb884.auth.domain.service;

import org.gregb884.auth.application.dto.ApplePurchaseResult;
import org.gregb884.auth.infrastructure.service.AiCoinService;
import org.gregb884.auth.infrastructure.service.AppleStoreService;
import org.gregb884.auth.infrastructure.service.SubscriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.*;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.test.web.client.MockRestServiceServer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class AppleStoreServiceTest {

    private AiCoinService aiCoinService;
    private SubscriptionService subscriptionService;
    private AppleStoreService appleStoreService;
    private RestTemplate restTemplate;
    private MockRestServiceServer server;

    @BeforeEach
    void setUp() {
        aiCoinService = mock(AiCoinService.class);
        subscriptionService = mock(SubscriptionService.class);
        restTemplate = new RestTemplate();
        appleStoreService = new AppleStoreService(aiCoinService, subscriptionService, restTemplate);
        server = MockRestServiceServer.bindTo(restTemplate).build();

        ReflectionTestUtils.setField(appleStoreService, "secret", "fake-secret");
    }

    @Test
    void shouldReturnApplePurchaseResultWithAiCoin() {
        String receipt = "fake-receipt";
        when(aiCoinService.addOneAiCoin()).thenReturn(true);

        mockProductionResponse("""
            {
              "status": 0,
              "receipt": { "bundle_id": "gregb884.TrainifyHub" },
              "latest_receipt_info": [
                { "product_id": "coin", "original_purchase_date_pst": "Tue Jan 1 10:00:00 PST 2024" }
              ]
            }
        """);

        ApplePurchaseResult result = appleStoreService.verify(receipt);
        assertThat(result.isSuccess()).isTrue();
        assertThat(result.isSubscription()).isFalse();
        assertThat(result.getErrorMessage()).isEmpty();
    }

    @Test
    void shouldReturnApplePurchaseResultWithSubscription() {
        String receipt = "fake-receipt";
        when(subscriptionService.changeTimeExpireSubscription(anyLong(), anyString())).thenReturn(true);

        mockProductionResponse("""
            {
              "status": 0,
              "receipt": { "bundle_id": "gregb884.TrainifyHub" },
              "latest_receipt_info": [
                {
                  "product_id": "sub",
                  "expires_date_ms": "9999999999999",
                  "original_purchase_date_pst": "Tue Jan 1 10:00:00 PST 2024"
                }
              ]
            }
        """);

        ApplePurchaseResult result = appleStoreService.verify(receipt);
        assertThat(result.isSubscription()).isTrue();
        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getErrorMessage()).isEmpty();
    }

    @Test
    void shouldRedirectToSandboxAndStillWork() {
        String receipt = "fake-receipt";

        mockProductionResponse("""
        {
          "status": 21007
        }
    """);

        mockSandboxResponse("""
    {
      "status": 0,
      "receipt": { "bundle_id": "gregb884.TrainifyHub" },
      "latest_receipt_info": [
        { "product_id": "coin", "original_purchase_date_pst": "Tue Jan 1 10:00:00 PST 2024" }
      ]
    }
""");

        when(aiCoinService.addOneAiCoin()).thenReturn(true);

        ApplePurchaseResult result = appleStoreService.verify(receipt);

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.isSubscription()).isFalse();
        assertThat(result.getErrorMessage()).isEmpty();

        server.verify();
    }

    @Test
    void shouldReturnErrorWhenBundleIdDoesNotMatch() {
        mockProductionResponse("""
            {
              "status": 0,
              "receipt": { "bundle_id": "invalid.bundle" },
              "latest_receipt_info": []
            }
        """);

        ApplePurchaseResult result = appleStoreService.verify("receipt");
        assertThat(result.getErrorMessage()).contains("not for this app");
        assertThat(result.isSuccess()).isFalse();
        assertThat(result.isSubscription()).isFalse();
    }

    @Test
    void shouldReturnErrorForInvalidStatus() {
        mockProductionResponse("""
            {
              "status": 999
            }
        """);

        ApplePurchaseResult result = appleStoreService.verify("receipt");
        assertThat(result.getErrorMessage()).contains("Apple verification failed");
    }

    // Helpers
    private void mockProductionResponse(String json) {
        server.expect(requestTo("https://buy.itunes.apple.com/verifyReceipt"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));
    }

    private void mockSandboxResponse(String json) {
        server.expect(requestTo("https://sandbox.itunes.apple.com/verifyReceipt"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));
    }
}