package org.gregb884.aiassist.infrastructure.adapter.out.persistence.repositoryAdapter;


import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.domain.repository.OptionalExerciseRepositoryPort;
import org.gregb884.aiassist.infrastructure.adapter.out.persistence.jpaRepository.JpaOptionalExerciseRepository;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OptionalExerciseRepositoryAdapter implements OptionalExerciseRepositoryPort {

    private final JpaOptionalExerciseRepository jpaOptionalExerciseRepository;



}
