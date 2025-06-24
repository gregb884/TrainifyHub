package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.domain.model.TrainingPlan;
import org.gregb884.trainingmanager.domain.repository.TrainingPlanRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository.TrainingPlanJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TrainingPlanRepositoryAdapter implements TrainingPlanRepositoryPort {

    private final TrainingPlanJpaRepository trainingPlanJpaRepository;


    @Override
    public Optional<TrainingPlan> findByIdAndCreatorIdOrUserId(Long id, Long creatorId, Long userId) {
       return trainingPlanJpaRepository.findByIdAndCreatorIdOrUserId(id,creatorId, userId);
    }

    @Override
    public Optional<TrainingPlan> findByIdAndCreatorId(Long id, Long creatorId) {
        return trainingPlanJpaRepository.findByIdAndCreatorId(id, creatorId);
    }

    @Override
    public Optional<List<TrainingPlan>> findByCreatorIdOrUserId(Long creatorId, Long userId) {
        return trainingPlanJpaRepository.findByCreatorIdOrUserId(creatorId,userId);
    }

    @Override
    public Optional<List<TrainingPlan>> findTemplatesByCreatorId(Long creatorId) {
        return trainingPlanJpaRepository.findTemplatesByCreatorId(creatorId);
    }

    @Override
    public Long countByCreatorIdOrUserId(long userId) {
        return trainingPlanJpaRepository.countByCreatorIdOrUserId(userId);
    }

    @Override
    public Long countDistinctUserIdsByCreatorIdOrUserId(Long userId) {
        return trainingPlanJpaRepository.countDistinctUserIdsByCreatorIdOrUserId(userId);
    }

    @Override
    public List<String> findDistinctUsernamesByCreatorIdOrUserId(Long userId) {
        return trainingPlanJpaRepository.findDistinctUsernamesByCreatorIdOrUserId(userId);
    }

    @Override
    public Long countTrainingPlanByUserIdWithoutSchema(Long userId) {
        return trainingPlanJpaRepository.countTrainingPlanByUserIdWithoutSchema(userId);
    }

    @Override
    public Long countSchemaByTrainerId(Long userId) {
        return trainingPlanJpaRepository.countSchemaByTrainerId(userId);
    }

    @Override
    public Long countPlanToCheck(Long userId) {
        return trainingPlanJpaRepository.countPlanToCheck(userId);
    }

    @Override
    public Optional<List<TrainingPlan>> findFirstByClosestUnfinishedTrainingPlanForUser(Long userId) {
        return trainingPlanJpaRepository.findFirstByClosestUnfinishedTrainingPlanForUser(userId);
    }

    @Override
    public TrainingPlan save(TrainingPlan trainingPlan) {
       return trainingPlanJpaRepository.save(trainingPlan);
    }

    @Override
    public void deleteById(long id) {
        trainingPlanJpaRepository.deleteById(id);
    }
}
