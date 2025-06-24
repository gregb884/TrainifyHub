package org.gregb884.auth.infrastructure.service;

import org.gregb884.auth.application.dto.ApplePurchaseResult;
import org.gregb884.auth.application.port.out.ApplePurchaseVerifierPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AppleStoreService implements ApplePurchaseVerifierPort {

    @Value("${apple.sharedSecret}")
    private String secret;

    private static final String APPLE_PRODUCTION_URL = "https://buy.itunes.apple.com/verifyReceipt";
    private static final String APPLE_SANDBOX_URL = "https://sandbox.itunes.apple.com/verifyReceipt";
    private static final String BUNDLE_ID = "gregb884.TrainifyHub";

    private final AiCoinService aiCoinService;
    private final SubscriptionService subscriptionService;
    private final RestTemplate restTemplate;

    public AppleStoreService(AiCoinService aiCoinService, SubscriptionService subscriptionService, RestTemplate restTemplate) {
        this.aiCoinService = aiCoinService;
        this.subscriptionService = subscriptionService;
        this.restTemplate = restTemplate;
    }

    @Override
    public ApplePurchaseResult verify(String receipt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("receipt-data", receipt);
        requestBody.put("password", secret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {

            ApplePurchaseResult result = processVerification(restTemplate, APPLE_PRODUCTION_URL, requestEntity);
            if (isSandboxRedirect(result)) {
                result = processVerification(restTemplate, APPLE_SANDBOX_URL, requestEntity);
            }
            return result;
        } catch (Exception e) {
            return new ApplePurchaseResult(false, false, "Error Apple API: " + e.getMessage());
        }
    }

    private ApplePurchaseResult processVerification(RestTemplate restTemplate, String url, HttpEntity<Map<String, Object>> requestEntity) {
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);
        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null || responseBody.get("status") == null) {
            return new ApplePurchaseResult(false, false, "Empty or invalid response from Apple");
        }

        int status = (int) responseBody.get("status");
        if (status == 0) {
            Map<String, Object> receiptInfo = (Map<String, Object>) responseBody.get("receipt");
            if (receiptInfo == null || !BUNDLE_ID.equals(receiptInfo.get("bundle_id"))) {
                return new ApplePurchaseResult(false, false, "This receipt is not for this app");
            }
            return handleResponse(responseBody);
        } else if (status == 21007) {
            return new ApplePurchaseResult(false, false, "SANDBOX_REDIRECT");
        }

        return new ApplePurchaseResult(false, false, "Apple verification failed with status: " + status);
    }

    private boolean isSandboxRedirect(ApplePurchaseResult result) {
        return "SANDBOX_REDIRECT".equals(result.getErrorMessage());
    }

    private ApplePurchaseResult handleResponse(Map<String, Object> responseBody) {
        List<Map<String, Object>> receiptInfoList = (List<Map<String, Object>>) responseBody.get("latest_receipt_info");

        if (receiptInfoList == null || receiptInfoList.isEmpty()) {
            return new ApplePurchaseResult(false, false, "No receipt info found");
        }

        for (Map<String, Object> entry : receiptInfoList) {
            if (entry.containsKey("expires_date_ms")) {
                String expiresMsRaw = String.valueOf(entry.get("expires_date_ms"));
                Long expiresDateMs = Long.parseLong(expiresMsRaw);
                String expiresDatePst = (String) entry.get("original_purchase_date_pst");

                String zone = extractZone(expiresDatePst);

                if (subscriptionService.changeTimeExpireSubscription(expiresDateMs, zone)) {
                    return new ApplePurchaseResult(false, true, "");
                }
            } else {
                if (aiCoinService.addOneAiCoin()) {
                    return new ApplePurchaseResult(true, false, "");
                }
            }
        }

        return new ApplePurchaseResult(false, false, "Receipt info processed but no valid action executed");
    }

    private String extractZone(String datePst) {
        if (datePst != null && datePst.contains(" ")) {
            String[] parts = datePst.split(" ");
            if (parts.length == 3) {
                return parts[2];
            }
        }
        return "";
    }
}