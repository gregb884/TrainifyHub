package org.gregb884.trainingmanager.repository;

import org.gregb884.trainingmanager.model.WorkoutPlans;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkoutPlansRepository extends JpaRepository<WorkoutPlans, Long> {


    List<WorkoutPlans> findAllByLang(String lang);

    Optional<WorkoutPlans> findByPlanId(long id);
}
