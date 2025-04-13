package org.gregb884.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AppleStoreService {

    private final UserService userService;


    @Value("${apple.sharedSecret}")
    private String secret;

    private final String APPLE_PRODUCTION_URL = "https://buy.itunes.apple.com/verifyReceipt";
    private final String APPLE_SANDBOX_URL = "https://sandbox.itunes.apple.com/verifyReceipt";

    public AppleStoreService(UserService userService) {
        this.userService = userService;
    }

    public ResponseEntity<?> verifyPayment(String receipt) {

        String appleUrl = APPLE_PRODUCTION_URL;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("receipt-data", receipt);
        requestBody.put("password", secret);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(appleUrl, HttpMethod.POST, requestEntity, Map.class);
            Map responseBody = response.getBody();

            if (responseBody != null && responseBody.get("status") != null) {
                int status = (int) responseBody.get("status");

                if (status == 0) {
                    Map<String, Object> receiptInfo = (Map<String, Object>) responseBody.get("receipt");
                    String bundleId = (String) receiptInfo.get("bundle_id");

                    if (!"gregb884.TrainifyHub".equals(bundleId)) {
                        return ResponseEntity.badRequest().body("❌ Błąd: Paragon nie należy do tej aplikacji!");
                    }


                    List<Map<String, Object>> receiptInfoList = (List<Map<String, Object>>) responseBody.get("latest_receipt_info");

                    for (Map<String, Object> entry : receiptInfoList) {

                        if (entry.containsKey("expires_date_ms")) {
                            String productId = (String) entry.get("product_id");
                            String expiresMsRaw = String.valueOf(entry.get("expires_date_ms"));
                            Long expiresDateMs = Long.parseLong(expiresMsRaw);
                            String expiresDatePst = (String) entry.get("original_purchase_date_pst");

                            String zone = "";
                            if (expiresDatePst != null && expiresDatePst.contains(" ")) {
                                String[] parts = expiresDatePst.split(" ");
                                if (parts.length == 3) {
                                    zone = parts[2];
                                }
                            }

                            if (userService.changeTimeExpireSubscription(expiresDateMs, zone)) {

                                return ResponseEntity.ok("Confirm Sub");
                            }


                        } else {

                            if (userService.addOneAiCoin()) {
                                return ResponseEntity.ok("Confirm Payment");
                            }
                        }

                    }


                } else if (status == 21007) {
                    appleUrl = APPLE_SANDBOX_URL;
                    response = restTemplate.exchange(appleUrl, HttpMethod.POST, requestEntity, Map.class);
                    responseBody = response.getBody();


                    Map<String, Object> responseMap = (Map<String, Object>) responseBody;
                    for (Map.Entry<String, Object> field : responseMap.entrySet()) {
                        System.out.println("🔹 " + field.getKey() + ": " + field.getValue());
                    }

                    if (responseBody != null && responseBody.get("status") != null && (int) responseBody.get("status") == 0) {

                            List<Map<String, Object>> receiptInfoList = (List<Map<String, Object>>) responseBody.get("latest_receipt_info");

                            for (Map<String, Object> entry : receiptInfoList) {


                                if (entry.containsKey("expires_date_ms")) {
                                    String productId = (String) entry.get("product_id");
                                    String expiresMsRaw = String.valueOf(entry.get("expires_date_ms"));
                                    Long expiresDateMs = Long.parseLong(expiresMsRaw);
                                    String expiresDatePst = (String) entry.get("original_purchase_date_pst");

                                    String zone = "";
                                    if (expiresDatePst != null && expiresDatePst.contains(" ")) {
                                        String[] parts = expiresDatePst.split(" ");
                                        if (parts.length == 3) {
                                            zone = parts[2];
                                        }
                                    }

                                    if(userService.changeTimeExpireSubscription(expiresDateMs,zone)){

                                        return ResponseEntity.ok("Confirm Sub");
                                    }


                                } else {

                                    if (userService.addOneAiCoin()) {
                                        return ResponseEntity.ok("Confirm Payment");
                                    }
                                }


                        }

                    }
                }
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Błąd Apple API: " + responseBody);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Błąd komunikacji z Apple: " + e.getMessage());
        }

    }


}
