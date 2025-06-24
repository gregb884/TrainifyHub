package org.gregb884.aiassist.infrastructure.adapter.out.api;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.port.out.TrainingManagerPlanCreatorPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TrainingManagerPlanCreatorAdapter implements TrainingManagerPlanCreatorPort {

    private final RestTemplate restTemplate;
    private static final String URL = "http://TRAININGMANAGER/api/trainingPlan/createAiPlan";

    @Override
    public Long createPlanFromAiPlanIdInTrainingManager(long aiPlanId, Date startDate, String days) throws Exception {

        String requestUrl = URL + "?aiTrainingPlanId=" + aiPlanId + "&startDate=" + startDate + "&days=" + days;

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    requestUrl,
                    HttpMethod.POST,
                    null,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return Long.valueOf(Objects.requireNonNull(response.getBody()));
            } else {
                throw new Exception("TRAININGMANAGER returned error: " + response.getStatusCode());
            }

        } catch (Exception e) {
            throw new Exception("Failed to send request to TRAININGMANAGER: " + e.getMessage(), e);
        }
    }


}
