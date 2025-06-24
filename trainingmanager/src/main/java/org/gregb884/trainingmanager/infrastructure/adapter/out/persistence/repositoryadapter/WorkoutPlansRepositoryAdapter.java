package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.domain.model.WorkoutPlans;
import org.gregb884.trainingmanager.domain.repository.WorkoutPlansRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository.WorkoutPlansJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class WorkoutPlansRepositoryAdapter implements WorkoutPlansRepositoryPort {


    private final WorkoutPlansJpaRepository workoutPlansJpaRepository;

    @Override
    public List<WorkoutPlans> findAllByLang(String lang) {
        return workoutPlansJpaRepository.findAllByLang(lang);
    }

    @Override
    public Optional<WorkoutPlans> findByPlanId(long id) {
        return workoutPlansJpaRepository.findByPlanId(id);
    }

    @Override
    public List<WorkoutPlans> findAll() {
        return workoutPlansJpaRepository.findAll();
    }

    @Override
    public void save(WorkoutPlans workoutPlans) {
        workoutPlansJpaRepository.save(workoutPlans);
    }
}
