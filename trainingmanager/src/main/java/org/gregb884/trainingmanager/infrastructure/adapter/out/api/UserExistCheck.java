package org.gregb884.trainingmanager.infrastructure.adapter.out.api;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.port.out.UserExistCheckPort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class UserExistCheck implements UserExistCheckPort {


    String userServiceUrl = "http://auth/api/users/exist?userName=";

    private final RestTemplate restTemplate;


    @Override
    public boolean userExistsInAuthModule(String userName){

        try {

            ResponseEntity<String> userExistResponse = restTemplate.getForEntity(userServiceUrl + userName, String.class);

            return userExistResponse.getStatusCode().is2xxSuccessful();


        } catch (Exception e){

            return false;
        }

    }

}
