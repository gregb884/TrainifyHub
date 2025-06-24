package org.gregb884.messenger.infrastructure.adapter.out.api;

import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.application.port.out.UserProfileImageFetcherPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;



@Service
@RequiredArgsConstructor
public class ImageAdapter implements UserProfileImageFetcherPort {


    private static final String PROFILE_URL = "http://PROFILEMANAGER/api/profileImage/get";

    private final RestTemplate restTemplate;


    @Override
    public String getImgUrlForUser(String userName) {
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    PROFILE_URL + "?userName=" + userName,
                    HttpMethod.GET,
                    null,
                    String.class
            );
            return response.getBody();
        } catch (Exception e) {

            System.out.println(e.getMessage());
            return null;
        }

    }

}
