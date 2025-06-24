package org.gregb884.trainingmanager.domain.repository;
import org.gregb884.trainingmanager.domain.model.Day;

import java.util.Optional;

public interface DayRepositoryPort {

    Optional<Day> findByIdAndOnlyCreatorId(Long dayId, Long userId);

    Optional<Day> findByIdAndUserIdOrCreatorId(Long dayId, Long userId);

    void save(Day newDay);

    void delete(Day day);
}
