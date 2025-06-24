package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.domain.model.Week;
import org.gregb884.trainingmanager.domain.repository.WeekRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository.WeekJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class WeekRepositoryAdapter implements WeekRepositoryPort {


    private final WeekJpaRepository weekJpaRepository;

    @Override
    public Optional<Week> findByIdAndUserId(Long weekId, Long userId) {
        return weekJpaRepository.findByIdAndUserId(weekId, userId);
    }

    @Override
    public Optional<Week> findByIdAndOnlyCreatorId(Long weekId, Long userId) {
        return weekJpaRepository.findByIdAndOnlyCreatorId(weekId, userId);
    }

    @Override
    public void save(Week newWeek) {
        weekJpaRepository.save(newWeek);
    }

    @Override
    public void delete(Week week) {
        weekJpaRepository.delete(week);
    }
}
