package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;
import org.gregb884.trainingmanager.domain.repository.ExerciseSeriesRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository.ExerciseSeriesJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
@RequiredArgsConstructor
public class ExerciseSeriesRepositoryAdapter implements ExerciseSeriesRepositoryPort {


    private final ExerciseSeriesJpaRepository exerciseSeriesJpaRepository;

    @Override
    public Optional<ExerciseSeries> findByIdAndUserId(Long exerciseSeriesId, Long userId) {
        return exerciseSeriesJpaRepository.findByIdAndUserId(exerciseSeriesId, userId);
    }

    @Override
    public Optional<ExerciseSeries> findByIdAndCreatorId(Long exerciseSeriesId, Long userId) {
        return exerciseSeriesJpaRepository.findByIdAndCreatorId(exerciseSeriesId, userId);
    }

    @Override
    public void save(ExerciseSeries exerciseSeries) {
        exerciseSeriesJpaRepository.save(exerciseSeries);
    }

    @Override
    public void deleteAll(Set<ExerciseSeries> exerciseSeries) {
        exerciseSeriesJpaRepository.deleteAll(exerciseSeries);
    }
}
