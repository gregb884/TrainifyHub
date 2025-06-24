package org.gregb884.statistic.infrastructure.adapter.out.api;

import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.application.dto.ExerciseNameDto;
import org.gregb884.statistic.application.port.out.ExerciseNameFetcherPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseNameFetcherAdapter implements ExerciseNameFetcherPort {


    private final String trainingModuleGetExerciseNameList = "http://TRAININGMANAGER/api/exercise/getNameList";
    private final String trainingModuleGetExerciseName = "http://TRAININGMANAGER/api/exercise/getName?id=";

    private final RestTemplate restTemplate;

    @Override
    public List<ExerciseNameDto> getExerciseNameList(Page<Long> listExerciseId) throws Exception {

       try {
           ResponseEntity<List<ExerciseNameDto>> response = restTemplate.exchange(
                   trainingModuleGetExerciseNameList,
                   HttpMethod.POST,
                   new HttpEntity<>(listExerciseId.getContent()),
                   new ParameterizedTypeReference<List<ExerciseNameDto>>() {}
           );

           if (response.getStatusCode().is2xxSuccessful()) {
               return response.getBody();
           } else throw new Exception("Could not get exercise names");


       } catch (Exception e) {

           throw new Exception(e.getMessage());
       }

    }

    @Override
    public ExerciseNameDto getExerciseNameById(long id) throws Exception {

        try {
            ResponseEntity<ExerciseNameDto> response = restTemplate.getForEntity(
                    trainingModuleGetExerciseName + id , ExerciseNameDto.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else throw new Exception("Could not get exercise name");
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }


}
