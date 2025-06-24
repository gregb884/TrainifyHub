package org.gregb884.trainingmanager.application.service;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.ExerciseSeriesDto;
import org.gregb884.trainingmanager.application.port.in.ExerciseSeriesUseCase;
import org.gregb884.trainingmanager.application.port.out.StatisticSenderPort;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;
import org.gregb884.trainingmanager.domain.repository.ExerciseSeriesRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class ExerciseSeriesService implements ExerciseSeriesUseCase {


    private final ExerciseSeriesRepositoryPort exerciseSeriesRepository;
    private final AuthenticatedUser authenticatedUser;
    private final StatisticSenderPort statisticSenderPort;

    @Override
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


    @Override
    public void deleteListExerciseSeries(Set<ExerciseSeries> exerciseSeries) throws Exception{

        if (exerciseSeries.isEmpty()) throw new Exception("No exerciseSeries found");

        Optional<ExerciseSeries> exerciseSeriesOptional =
                exerciseSeriesRepository.findByIdAndCreatorId(exerciseSeries.stream().findFirst().get().getId(),
                        authenticatedUser.getUserId());

        if (exerciseSeriesOptional.isPresent()) {
            exerciseSeriesRepository.deleteAll(exerciseSeries);
        }

    }

    @Override
    public Optional<ExerciseSeries> edit(long id, ExerciseSeriesDto exerciseSeriesDto) throws Exception {


        Optional<ExerciseSeries> exerciseSeriesToEdit = exerciseSeriesRepository.findByIdAndUserId(id, authenticatedUser.getUserId());

        if (exerciseSeriesToEdit.isEmpty()) throw new Exception("No access to edit");

        exerciseSeriesToEdit.get().setAdditionalInfo(exerciseSeriesDto.getAdditionalInfo());
        exerciseSeriesToEdit.get().setTotalWeight(exerciseSeriesDto.getTotalWeight());
        exerciseSeriesToEdit.get().setTotalRepetitions(exerciseSeriesDto.getTotalRepetitions());
        exerciseSeriesRepository.save(exerciseSeriesToEdit.get());

        statisticSenderPort.sendSeriesToStatisticModule(exerciseSeriesDto,exerciseSeriesToEdit.get().getExercisePlan().getExercise().getId());

        return exerciseSeriesToEdit;
    }

}
