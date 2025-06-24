package org.gregb884.statistic.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.domain.model.ExerciseStats;
import org.gregb884.statistic.domain.repository.ExerciseStatsRepositoryPort;
import org.gregb884.statistic.infrastructure.adapter.out.persistence.jparepository.ExerciseStatsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ExerciseStatsRepositoryAdapter implements ExerciseStatsRepositoryPort {

    private final ExerciseStatsRepository exerciseStatsRepository;


    @Override
    public boolean existsByExerciseIdAndUserId(long exerciseId, long userId) {
        return exerciseStatsRepository.existsByExerciseIdAndUserId(exerciseId, userId);
    }

    @Override
    public Optional<Double> findHighestOneRepMaxByExerciseIdAndUserId(long exerciseId, long userId) {
        return exerciseStatsRepository.findHighestOneRepMaxByExerciseIdAndUserId(exerciseId, userId);
    }

    @Override
    public List<Date> findLastRecordedDateBefore(long exerciseId, long userId, Date providedDate, Pageable pageable) {
        return exerciseStatsRepository.findLastRecordedDateBefore(exerciseId, userId, providedDate, pageable);
    }

    @Override
    public Optional<List<ExerciseStats>> findRecordsFromDate(long exerciseId, long userId, Date startOfDay, Date endOfDay) {
        return exerciseStatsRepository.findRecordsFromDate(exerciseId, userId, startOfDay, endOfDay);
    }

    @Override
    public Page<Long> findDistinctExerciseIdsByUserId(long userId, Pageable pageable) {
        return exerciseStatsRepository.findDistinctExerciseIdsByUserId(userId, pageable);
    }

    @Override
    public Optional<List<ExerciseStats>> findByExerciseIdAndUserId(long exerciseId, long userId) {
        return exerciseStatsRepository.findByExerciseIdAndUserId(exerciseId, userId);
    }

    @Override
    public void save(ExerciseStats exerciseStats) {
        exerciseStatsRepository.save(exerciseStats);
    }
}
