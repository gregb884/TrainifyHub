package org.gregb884.aiassist.infrastructure.adapter.out.api;


import groovy.util.logging.Slf4j;
import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.port.out.CoinCheckerPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class CoinAdapter implements CoinCheckerPort {

    private static final String checkAiCoins = "http://AUTH/api/users/checkAiCoins";
    private static final String consumeAiCoins = "http://AUTH/api/users/consumeAiCoin";
    private static final Logger log = LoggerFactory.getLogger(CoinAdapter.class);

    private final RestTemplate restTemplate;

    @Override
    public void userHasCoin() throws Exception {

        ResponseEntity<String> response = restTemplate.exchange(
                checkAiCoins,
                HttpMethod.GET,
                null,
                String.class);

        if (!response.getStatusCode().is2xxSuccessful()){
            log.error("Exception while checking coins{}", response.getBody());
            throw new Exception("Error while download coins " + response.getBody());
        }

        if ( Integer.parseInt(Objects.requireNonNull(response.getBody())) < 1 ){
            log.warn("No coins available{}", response.getBody());
            throw new Exception("No coins available " + response.getBody());
        }
    }

    @Override
    public boolean coinConsume() throws Exception {

        ResponseEntity<String> response = restTemplate.exchange(
                consumeAiCoins,
                HttpMethod.POST,
                null,
                String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("Failed consume Coin :{}", response.getBody());
            throw new Exception("Failed consume Coin : " + response.getBody());
        }

        return true;
    }


}
