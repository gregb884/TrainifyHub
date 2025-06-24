package org.gregb884.trainingmanager.domain.repository;

import org.gregb884.trainingmanager.domain.model.WorkoutPlans;

import java.util.List;
import java.util.Optional;

public interface WorkoutPlansRepositoryPort {

    List<WorkoutPlans> findAllByLang(String lang);

    Optional<WorkoutPlans> findByPlanId(long id);

    List<WorkoutPlans> findAll();

    void save(WorkoutPlans workoutPlans);
}
