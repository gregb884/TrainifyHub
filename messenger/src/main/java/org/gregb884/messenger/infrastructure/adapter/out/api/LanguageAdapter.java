package org.gregb884.messenger.infrastructure.adapter.out.api;

import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.application.port.out.UserLanguageFetcherPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class LanguageAdapter implements UserLanguageFetcherPort {

    private static final String AUTH_URL = "http://AUTH/api/users/lang";

    private final RestTemplate restTemplate;

    @Override
    public String getLang(String userName) {

        try {

            ResponseEntity<String> response = restTemplate.exchange(
                    AUTH_URL + "?userName=" + userName,
                    HttpMethod.GET,
                    null,
                    String.class
            );

            return response.getBody();


        } catch (Exception e) {

            e.getMessage();

        }

        return "";
    }

}
