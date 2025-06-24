package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.repository.DayRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository.DayJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DayRepositoryAdapter implements DayRepositoryPort {


    private final DayJpaRepository dayJpaRepository;


    @Override
    public Optional<Day> findByIdAndOnlyCreatorId(Long dayId, Long userId) {
        return dayJpaRepository.findByIdAndOnlyCreatorId(dayId, userId);
    }

    @Override
    public Optional<Day> findByIdAndUserIdOrCreatorId(Long dayId, Long userId) {
        return dayJpaRepository.findByIdAndUserIdOrCreatorId(dayId, userId);
    }

    @Override
    public void save(Day newDay) {
        dayJpaRepository.save(newDay);
    }

    @Override
    public void delete(Day day) {
        dayJpaRepository.delete(day);
    }
}
