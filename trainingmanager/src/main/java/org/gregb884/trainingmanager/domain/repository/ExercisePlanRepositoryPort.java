package org.gregb884.trainingmanager.domain.repository;

import org.gregb884.trainingmanager.domain.model.ExercisePlan;

import java.util.Optional;


public interface ExercisePlanRepositoryPort {

    Optional<ExercisePlan> findByIdAndUserIdOrCreatorId(Long dayId, Long userId);

    void save(ExercisePlan exercisePlan);

    void delete(ExercisePlan exercisePlan);
}
