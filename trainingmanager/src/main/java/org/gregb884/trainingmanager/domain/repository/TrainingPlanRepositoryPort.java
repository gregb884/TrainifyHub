package org.gregb884.trainingmanager.domain.repository;


import org.gregb884.trainingmanager.domain.model.TrainingPlan;

import java.util.List;
import java.util.Optional;

public interface TrainingPlanRepositoryPort {



    Optional<TrainingPlan> findByIdAndCreatorIdOrUserId(Long id, Long creatorId, Long userId);

    Optional<TrainingPlan> findByIdAndCreatorId(Long id, Long creatorId);

    Optional<List<TrainingPlan>> findByCreatorIdOrUserId(Long creatorId, Long userId);

    Optional<List<TrainingPlan>> findTemplatesByCreatorId(Long creatorId);

    Long countByCreatorIdOrUserId(long userId);

    Long countDistinctUserIdsByCreatorIdOrUserId(Long userId);

    List<String> findDistinctUsernamesByCreatorIdOrUserId(Long userId);

    Long countTrainingPlanByUserIdWithoutSchema(Long userId);

    Long countSchemaByTrainerId(Long userId);

    Long countPlanToCheck(Long userId);

    Optional<List<TrainingPlan>> findFirstByClosestUnfinishedTrainingPlanForUser(Long userId);

    TrainingPlan save(TrainingPlan trainingPlan);

    void deleteById(long id);
}
