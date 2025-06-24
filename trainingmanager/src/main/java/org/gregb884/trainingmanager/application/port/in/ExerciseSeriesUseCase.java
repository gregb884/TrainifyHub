package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.ExerciseSeriesDto;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;

import java.util.Optional;
import java.util.Set;

public interface ExerciseSeriesUseCase {


    Set<ExerciseSeries> createSeriesForPlan(ExercisePlan exercisePlan);
    void deleteListExerciseSeries(Set<ExerciseSeries> exerciseSeries) throws Exception;
    Optional<ExerciseSeries> edit(long id, ExerciseSeriesDto exerciseSeriesDto) throws Exception;

}
