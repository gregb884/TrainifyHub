package org.gregb884.trainingmanager.infrastructure.adapter.out.api;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.application.port.out.AiPlanPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
public class AiPlanAdapter implements AiPlanPort {


    private static final String aiPlanDownload_URL = "http://AIASSIST/api/aiPlan/get" ;

    private final RestTemplate restTemplate;


    @Override
    public AiTrainingPlan downloadAiPlan(long aiTrainingPlanId) throws Exception {

        try {
            ResponseEntity<AiTrainingPlan> response = restTemplate.exchange(
                    aiPlanDownload_URL + "?id=" + aiTrainingPlanId,
                    HttpMethod.GET,
                    null,
                    AiTrainingPlan.class
            );


            AiTrainingPlan aiTrainingPlan = response.getBody();

            return response.getBody();

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }

    }


}
