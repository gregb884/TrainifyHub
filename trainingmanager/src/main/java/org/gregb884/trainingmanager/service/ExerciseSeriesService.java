package org.gregb884.trainingmanager.service;

import org.gregb884.trainingmanager.dto.ExerciseSeriesDto;
import org.gregb884.trainingmanager.dto.ExerciseStatsDto;
import org.gregb884.trainingmanager.mapper.ExerciseMapper;
import org.gregb884.trainingmanager.model.ExercisePlan;
import org.gregb884.trainingmanager.model.ExerciseSeries;
import org.gregb884.trainingmanager.model.User;
import org.gregb884.trainingmanager.repository.ExerciseSeriesRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class ExerciseSeriesService {

    private final ExerciseSeriesRepository exerciseSeriesRepository;
    private final UserService userService;
    private final RestTemplate restTemplate;

    public ExerciseSeriesService(ExerciseSeriesRepository exerciseSeriesRepository, UserService userService, RestTemplate restTemplate) {
        this.exerciseSeriesRepository = exerciseSeriesRepository;
        this.userService = userService;
        this.restTemplate = restTemplate;
    }


    public Set<ExerciseSeries> createSeriesForPlan(ExercisePlan exercisePlan) {

        Set<ExerciseSeries> exerciseSeriesSet = new HashSet<ExerciseSeries>();

        for (int i = 0;i < exercisePlan.getPlannedSeries();i++){

            ExerciseSeries exerciseSeries = new ExerciseSeries();
            exerciseSeries.setExercisePlan(exercisePlan);
            exerciseSeriesRepository.save(exerciseSeries);
            exerciseSeriesSet.add(exerciseSeries);
        }

        return exerciseSeriesSet;
    }


    public Optional<ExerciseSeries> edit(long id, ExerciseSeriesDto exerciseSeriesDto) {


        Optional<ExerciseSeries> exerciseSeriesToEdit = exerciseSeriesRepository.findByIdAndUserId(id, userService.getUserId());


            exerciseSeriesToEdit.get().setAdditionalInfo(exerciseSeriesDto.getAdditionalInfo());
            exerciseSeriesToEdit.get().setTotalWeight(exerciseSeriesDto.getTotalWeight());
            exerciseSeriesToEdit.get().setTotalRepetitions(exerciseSeriesDto.getTotalRepetitions());
            exerciseSeriesRepository.save(exerciseSeriesToEdit.get());

            sendStats(exerciseSeriesDto,exerciseSeriesToEdit.get().getExercisePlan().getExercise().getId());



            return exerciseSeriesToEdit;
    }

    public String sendStats(ExerciseSeriesDto exerciseSeriesDto, long exerciseId) {

        try {

            String addInStatsModule = "http://STATISTIC/api/stats/add";

            ExerciseStatsDto exerciseStatsDto = ExerciseMapper.toStatsDto(exerciseSeriesDto,exerciseId);

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

    public void deleteListExerciseSeries(Set<ExerciseSeries> exerciseSeries) {

        Optional<ExerciseSeries> exerciseSeriesOptional =
                exerciseSeriesRepository.findByIdAndCreatorId(exerciseSeries.stream().findFirst().get().getId(),
                        userService.getUserId());

        if (exerciseSeriesOptional.isPresent()) {

            exerciseSeriesRepository.deleteAll(exerciseSeries);
        }

    }
}
