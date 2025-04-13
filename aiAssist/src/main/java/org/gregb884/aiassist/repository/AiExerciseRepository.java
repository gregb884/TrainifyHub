package org.gregb884.aiassist.repository;

import org.gregb884.aiassist.model.AiExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AiExerciseRepository extends JpaRepository<AiExercise, Long> {

    @Query("SELECT a FROM AiExercise a WHERE a.id = :aiExerciseId AND a.aiDay.aiPlan.userId = :userId")
    Optional<AiExercise> findByIdWithCheckUser(@Param("aiExerciseId") Long aiExerciseId, @Param("userId") Long userId);
}
