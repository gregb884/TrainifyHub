package org.gregb884.trainingmanager.infrastructure.adapter.out.api;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.port.out.AccessToPaidPlansCheckPort;
import org.gregb884.trainingmanager.domain.model.Day;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccessToPaidPlansCheck implements AccessToPaidPlansCheckPort {

    private static final String checkAccessToPlans_URL = "http://AUTH/api/users/readyPlansAccessCheck" ;

    private final RestTemplate restTemplate;

    @Override
    public boolean accessToPaidPlan() throws Exception {

            try {

                ResponseEntity<String> response = restTemplate.exchange(
                        checkAccessToPlans_URL,
                        HttpMethod.GET,
                        null,
                        String.class
                );

                if (!response.getStatusCode().is2xxSuccessful() || response.getBody().equals("Access denied")) {

                    throw new Exception("No access to assign plan");
                }

            } catch (Exception e){

                throw new Exception("No access to assign plan");

            }


        return true;

    }



}
