package org.gregb884.trainingmanager.domain.repository;


import org.gregb884.trainingmanager.domain.model.Week;

import java.util.Optional;

public interface WeekRepositoryPort {

    Optional<Week> findByIdAndUserId(Long weekId, Long userId);

    Optional<Week> findByIdAndOnlyCreatorId(Long weekId, Long userId);

    void save(Week newWeek);

    void delete(Week week);
}
