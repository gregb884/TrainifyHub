package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Transactional
public interface ExercisePlanJpaRepository extends JpaRepository<ExercisePlan, Long> {


    @Query("SELECT ep FROM ExercisePlan ep JOIN ep.day d JOIN d.week w JOIN w.trainingPlan tp join tp.users u WHERE ep.id = :ExercisePlanId AND (u.id = :userId OR tp.creatorId = :userId)")
    Optional<ExercisePlan> findByIdAndUserIdOrCreatorId(@Param("ExercisePlanId") Long dayId, @Param("userId") Long userId);

}
