package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.ExercisePlanDto;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;

import java.util.Optional;

public interface ExercisePlanUseCase {

    void create(long dayId, ExercisePlanDto exercisePlanDto, long exerciseId) throws Exception;
    void edit(ExercisePlanDto exercisePlanDto, long exercisePlanId) throws Exception;
    Optional<ExercisePlan> getExercisePlan(long exercisePlanId);
    boolean delete(long exercisePlanId);

}
