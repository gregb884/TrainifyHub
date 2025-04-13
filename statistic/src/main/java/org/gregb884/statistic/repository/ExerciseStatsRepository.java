package org.gregb884.statistic.repository;

import org.gregb884.statistic.dto.ExerciseNameDto;
import org.gregb884.statistic.model.ExerciseStats;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ExerciseStatsRepository extends JpaRepository<ExerciseStats, Long> {


    @Query(value = "SELECT EXISTS(SELECT 1 FROM exercise_stats WHERE exercise_id = :exerciseId AND user_id = :userId)", nativeQuery = true)
    boolean existsByExerciseIdAndUserId(@Param("exerciseId") long exerciseId, @Param("userId") long userId);

    @Query("SELECT MAX(e.oneRepMax) FROM ExerciseStats e WHERE e.exerciseId = :exerciseId AND e.user.id = :userId")
    Optional<Double> findHighestOneRepMaxByExerciseIdAndUserId(@Param("exerciseId") long exerciseId, @Param("userId") long userId);

    @Query("SELECT e.addDate FROM ExerciseStats e WHERE e.exerciseId = :exerciseId " +
            "AND e.user.id = :userId AND e.addDate < :providedDate " +
            "ORDER BY e.addDate DESC")
    List<Date> findLastRecordedDateBefore(@Param("exerciseId") long exerciseId,
                                          @Param("userId") long userId,
                                          @Param("providedDate") Date providedDate,
                                          Pageable pageable);



    @Query("SELECT e FROM ExerciseStats e WHERE e.exerciseId = :exerciseId " +
            "AND e.user.id = :userId AND e.addDate BETWEEN :startOfDay AND :endOfDay")
    Optional<List<ExerciseStats>> findRecordsFromDate(@Param("exerciseId") long exerciseId,
                                            @Param("userId") long userId,
                                            @Param("startOfDay") Date startOfDay,
                                            @Param("endOfDay") Date endOfDay);



    @Query("SELECT DISTINCT e.exerciseId FROM ExerciseStats e WHERE e.user.id = :userId")
    Page<Long> findDistinctExerciseIdsByUserId(@Param("userId") long userId, Pageable pageable);


    @Query("SELECT e FROM ExerciseStats e WHERE e.exerciseId =:exerciseId " +
            "AND e.user.id = :userId" )
    Optional<List<ExerciseStats>> findByExerciseIdAndUserId(@Param("exerciseId") long exerciseId, @Param("userId") long userId);



}
