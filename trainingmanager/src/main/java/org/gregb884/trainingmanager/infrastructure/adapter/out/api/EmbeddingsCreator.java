package org.gregb884.trainingmanager.infrastructure.adapter.out.api;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.port.out.EmbeddingPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
public class EmbeddingsCreator implements EmbeddingPort {

    private static final String EMBEDDING_URL = "http://AIASSIST/api/embedding/create" ;

    private final RestTemplate restTemplate;

    @Override
    public String createEmbeddingForExercise(String exerciseName , long exerciseId){


        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    EMBEDDING_URL + "?exerciseName=" + exerciseName,
                    HttpMethod.POST,
                    null,
                    String.class
            );

            return response.getBody();

        } catch (Exception e) {

            System.err.println("Error processing exercise ID: " + exerciseId
                    + ", name: " + exerciseName
                    + " - " + e.getMessage());

            return null;
        }


    }


    @Override
    public String getEmbeddingName(String exerciseName) throws Exception{


        try {

            ResponseEntity<String> response = restTemplate.exchange(
                    EMBEDDING_URL + "?exerciseName=" + exerciseName,
                    HttpMethod.POST,
                    null,
                    String.class
            );

            return response.getBody();


        } catch (Exception e) {

            throw new Exception(e.getMessage());

        }

    }



}
