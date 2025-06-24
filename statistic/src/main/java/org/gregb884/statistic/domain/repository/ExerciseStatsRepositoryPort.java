package org.gregb884.statistic.domain.repository;

import org.gregb884.statistic.domain.model.ExerciseStats;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ExerciseStatsRepositoryPort {


    boolean existsByExerciseIdAndUserId(long exerciseId, long userId);
    Optional<Double> findHighestOneRepMaxByExerciseIdAndUserId(long exerciseId, long userId);
    List<Date> findLastRecordedDateBefore(long exerciseId, long userId, Date providedDate, Pageable pageable);
    Optional<List<ExerciseStats>> findRecordsFromDate(long exerciseId, long userId, Date startOfDay, Date endOfDay);
    Page<Long> findDistinctExerciseIdsByUserId(long userId, Pageable pageable);
    Optional<List<ExerciseStats>> findByExerciseIdAndUserId(long exerciseId, long userId);
    void save(ExerciseStats exerciseStats);
}
