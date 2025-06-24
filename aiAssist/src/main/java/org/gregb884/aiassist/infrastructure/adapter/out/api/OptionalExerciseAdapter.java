package org.gregb884.aiassist.infrastructure.adapter.out.api;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.dto.ExerciseDtoForAi;
import org.gregb884.aiassist.application.port.out.OptionalExerciseFetcherPort;
import org.gregb884.aiassist.domain.model.OptionalExercise;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OptionalExerciseAdapter implements OptionalExerciseFetcherPort {

    private static final String trainingManagerMatchUrl = "http://TRAININGMANAGER/api/exercise/findMatch" ;

    private final RestTemplate restTemplate;

    @Override
    public Map<String, List<OptionalExercise>> getForExercises(List<String> names) {
        Map<String, List<OptionalExercise>> result = new HashMap<>();

        for (String name : names) {
            try {
                ResponseEntity<List<ExerciseDtoForAi>> response = restTemplate.exchange(
                        trainingManagerMatchUrl + "?exerciseName=" + name,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<ExerciseDtoForAi>>() {}
                );

                List<ExerciseDtoForAi> dtos = response.getBody();
                if (dtos == null) continue;

                List<OptionalExercise> optionals = dtos.stream().map(dto -> {
                    OptionalExercise o = new OptionalExercise();
                    o.setExerciseId(dto.getId());
                    o.setName(dto.getName());
                    o.setNamePl(dto.getNamePl());
                    o.setNameDe(dto.getNameDe());
                    o.setImageUrl(dto.getImageUrl());
                    return o;
                }).toList();

                if (!optionals.isEmpty()) {
                    optionals.get(0).setSelected(true);
                }

                result.put(name, optionals);

            } catch (Exception e) {
                e.printStackTrace();
                result.put(name, List.of());
            }
        }

        return result;
    }
}