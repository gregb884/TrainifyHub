package org.gregb884.trainingmanager.infrastructure.adapter.out.api;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.ExerciseSeriesDto;
import org.gregb884.trainingmanager.application.dto.ExerciseStatsDto;
import org.gregb884.trainingmanager.application.mapper.ExerciseSeriesToStatsMapper;
import org.gregb884.trainingmanager.application.port.out.StatisticSenderPort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
public class StatisticSender implements StatisticSenderPort {

    private final RestTemplate restTemplate;


    @Override
    public String sendSeriesToStatisticModule(ExerciseSeriesDto exerciseSeriesDto,long exerciseId){

        try {

            String addInStatsModule = "http://STATISTIC/api/stats/add";

            ExerciseStatsDto exerciseStatsDto = ExerciseSeriesToStatsMapper.toStatsDto(exerciseSeriesDto,exerciseId);

            ResponseEntity<String> statsResponse = restTemplate.postForEntity(addInStatsModule, exerciseStatsDto, String.class);

            if (statsResponse.getStatusCode().is2xxSuccessful()) {

                System.out.println(statsResponse.getBody());
                return statsResponse.getBody();

            }

        } catch (Exception e) {

            System.out.println(e.getMessage());

            return e.getMessage();
        }

        return "Fail Send to Stats";


    }




}
