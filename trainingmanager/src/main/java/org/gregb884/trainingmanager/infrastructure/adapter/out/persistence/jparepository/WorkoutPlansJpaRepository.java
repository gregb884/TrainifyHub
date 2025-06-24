package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository;


import org.gregb884.trainingmanager.domain.model.WorkoutPlans;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkoutPlansJpaRepository extends JpaRepository<WorkoutPlans, Long> {


    List<WorkoutPlans> findAllByLang(String lang);

    Optional<WorkoutPlans> findByPlanId(long id);
}
