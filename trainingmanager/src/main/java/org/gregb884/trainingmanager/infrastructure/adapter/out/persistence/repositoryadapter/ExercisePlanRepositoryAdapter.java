package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.repository.ExercisePlanRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository.ExercisePlanJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ExercisePlanRepositoryAdapter implements ExercisePlanRepositoryPort {

    private final ExercisePlanJpaRepository exercisePlanJpaRepository;



    @Override
    public Optional<ExercisePlan> findByIdAndUserIdOrCreatorId(Long dayId, Long userId) {
        return exercisePlanJpaRepository.findByIdAndUserIdOrCreatorId(dayId, userId);
    }

    @Override
    public void save(ExercisePlan exercisePlan) {
        exercisePlanJpaRepository.save(exercisePlan);
    }

    @Override
    public void delete(ExercisePlan exercisePlan) {
        exercisePlanJpaRepository.delete(exercisePlan);
    }
}
