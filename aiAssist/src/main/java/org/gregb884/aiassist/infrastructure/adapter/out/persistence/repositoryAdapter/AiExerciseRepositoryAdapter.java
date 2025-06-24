package org.gregb884.aiassist.infrastructure.adapter.out.persistence.repositoryAdapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.domain.model.AiExercise;
import org.gregb884.aiassist.domain.repository.AiExerciseRepositoryPort;
import org.gregb884.aiassist.infrastructure.adapter.out.persistence.jpaRepository.JpaAiExerciseRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
@RequiredArgsConstructor
public class AiExerciseRepositoryAdapter implements AiExerciseRepositoryPort {

    private final JpaAiExerciseRepository jpaAiExerciseRepository;

    @Override
    public Optional<AiExercise> findByIdWithCheckUser(Long aiExerciseId, Long userId) {
        return jpaAiExerciseRepository.findByIdWithCheckUser(aiExerciseId, userId);
    }

    @Override
    public AiExercise save(AiExercise aiExercise) {
       return jpaAiExerciseRepository.save(aiExercise);
    }
}
