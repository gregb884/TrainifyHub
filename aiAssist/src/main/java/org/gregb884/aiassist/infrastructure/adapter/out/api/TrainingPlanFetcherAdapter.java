package org.gregb884.aiassist.infrastructure.adapter.out.api;


import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.port.out.TrainingPlanSummaryFetcher;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class TrainingPlanFetcherAdapter implements TrainingPlanSummaryFetcher {


    private final RestTemplate restTemplate;

    private static final String getPlan_URL = "http://TRAININGMANAGER/api/trainingPlan/oldTrainingPlanForAi?id=" ;

    @Override
    public String fetchOldTrainingPlan(long id) throws Exception {
        String url = getPlan_URL + id;

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                throw new Exception("Failed to fetch old training plan");
            }

    }



}
