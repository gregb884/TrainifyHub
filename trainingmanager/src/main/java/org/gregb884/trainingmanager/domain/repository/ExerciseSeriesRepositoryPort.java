package org.gregb884.trainingmanager.domain.repository;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;

import java.util.Optional;
import java.util.Set;


public interface ExerciseSeriesRepositoryPort {

    Optional<ExerciseSeries> findByIdAndUserId(Long exerciseSeriesId, Long userId);

    Optional<ExerciseSeries> findByIdAndCreatorId(Long exerciseSeriesId, Long userId);

    void save(ExerciseSeries exerciseSeries);

    void deleteAll(Set<ExerciseSeries> exerciseSeries);
}
