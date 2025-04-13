package org.gregb884.trainingmanager.repository;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.model.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Transactional
public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Long> {


    @Query("SELECT tp FROM TrainingPlan tp LEFT JOIN tp.users u WHERE tp.id = :id AND (tp.creatorId = :creatorId OR u.id = :userId)")
    Optional<TrainingPlan> findByIdAndCreatorIdOrUserId(@Param("id") Long id, @Param("creatorId") Long creatorId, @Param("userId") Long userId);

    @Query("SELECT tp FROM TrainingPlan tp LEFT JOIN tp.users u WHERE tp.id = :id AND (tp.creatorId = :creatorId)")
    Optional<TrainingPlan> findByIdAndCreatorId(@Param("id") Long id, @Param("creatorId") Long creatorId);

    @Query("SELECT tp FROM TrainingPlan tp LEFT JOIN tp.users u WHERE (tp.creatorId = :creatorId OR u.id = :userId)")
    Optional<List<TrainingPlan>> findByCreatorIdOrUserId(@Param("creatorId") Long creatorId, @Param("userId") Long userId);

    @Query("SELECT tp FROM TrainingPlan tp WHERE tp.creatorId = :creatorId AND tp.template = true")
    Optional<List<TrainingPlan>> findTemplatesByCreatorId(@Param("creatorId") Long creatorId);

    @Query("SELECT COUNT(tp) FROM TrainingPlan tp LEFT JOIN tp.users u WHERE tp.creatorId = :userId OR u.id = :userId")
    Long countByCreatorIdOrUserId(@Param("userId") long userId);


    @Query("SELECT COUNT(DISTINCT u.id) FROM TrainingPlan tp LEFT JOIN tp.users u WHERE tp.creatorId = :userId OR u.id = :userId")
    Long countDistinctUserIdsByCreatorIdOrUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT u.username FROM TrainingPlan tp LEFT JOIN tp.users u WHERE tp.creatorId = :userId OR u.id = :userId")
    List<String> findDistinctUsernamesByCreatorIdOrUserId(@Param("userId") Long userId);


    @Query("SELECT COUNT(tp) FROM TrainingPlan tp LEFT JOIN tp.users u WHERE u.id = :userId AND tp.template = false")
    Long countTrainingPlanByUserIdWithoutSchema(@Param("userId") Long userId);


    @Query("SELECT COUNT(tp) FROM TrainingPlan tp WHERE tp.creatorId = :userId AND tp.template = true")
    Long countSchemaByTrainerId(@Param("userId") Long userId);


    @Query("SELECT COUNT(tp) FROM TrainingPlan tp WHERE tp.creatorId = :userId and tp.checked = false")
    Long countPlanToCheck(@Param("userId") Long userId);

    @Query("""
    SELECT tp
    FROM TrainingPlan tp
    JOIN tp.users u
    JOIN tp.weeks w
    JOIN w.days d
    JOIN d.exercisePlans ep
    WHERE u.id = :userId
    AND d.doneDate IS NULL
    AND d.plannedDate >= CURRENT_DATE
    ORDER BY d.plannedDate ASC, ep.exerciseOrder ASC
""")
    Optional<List<TrainingPlan>> findFirstByClosestUnfinishedTrainingPlanForUser(@Param("userId") Long userId);
}
