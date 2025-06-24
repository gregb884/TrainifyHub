package org.gregb884.aiassist.infrastructure.adapter.out.api;


import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.dto.ExerciseDtoOnlyEnName;
import org.gregb884.aiassist.application.port.out.ExerciseForMuscleFetcherPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseForMuscleAdapter implements ExerciseForMuscleFetcherPort {

    private static final String getFocusExercise_URL = "http://TRAININGMANAGER/api/exercise/getListForMuscleEn?mainMuscle=";

    private final RestTemplate restTemplate;


    @Override
    public List<String> getExercisesForMuscle(String mainMuscle) {
        String url = getFocusExercise_URL + mainMuscle;

        ResponseEntity<List<ExerciseDtoOnlyEnName>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ExerciseDtoOnlyEnName>>() {
                });

        List<ExerciseDtoOnlyEnName> exerciseDtos = response.getBody();

        if (!response.getStatusCode().is2xxSuccessful()) {

            return new ArrayList<>();
        }

        assert exerciseDtos != null;
        return exerciseDtos.stream().map(ExerciseDtoOnlyEnName::getName).collect(Collectors.toList());
    }




}
