package org.gregb884.aiassist.domain.repository;

import org.gregb884.aiassist.domain.model.AiExercise;

import java.util.Optional;

public interface AiExerciseRepositoryPort {

    Optional<AiExercise> findByIdWithCheckUser(Long aiExerciseId, Long userId);
    AiExercise save(AiExercise aiExercise);

}
