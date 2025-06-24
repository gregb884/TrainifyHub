package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Transactional
public interface ExerciseSeriesJpaRepository extends JpaRepository<ExerciseSeries, Long> {


    @Query("SELECT es FROM ExerciseSeries es JOIN es.exercisePlan ep JOIN ep.day d JOIN d.week w JOIN w.trainingPlan tp JOIN tp.users u WHERE es.id = :ExerciseSeriesId AND (u.id = :userId)")
    Optional<ExerciseSeries> findByIdAndUserId(@Param("ExerciseSeriesId") Long exerciseSeriesId, @Param("userId") Long userId);

    @Query("SELECT es FROM ExerciseSeries es JOIN es.exercisePlan ep JOIN ep.day d JOIN d.week w JOIN w.trainingPlan tp WHERE es.id = :ExerciseSeriesId AND (tp.creatorId = :userId)")
    Optional<ExerciseSeries> findByIdAndCreatorId(@Param("ExerciseSeriesId") Long exerciseSeriesId, @Param("userId") Long userId);

}
