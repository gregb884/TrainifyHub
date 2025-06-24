package org.gregb884.aiassist.domain.repository;

import org.gregb884.aiassist.domain.model.AiPlan;

import java.util.Optional;

public interface AiPlanRepositoryPort {


    Optional<AiPlan> findByIdAndUserId(Long userId, Long planId);


    AiPlan save(AiPlan aiPlan);

    void delete(AiPlan aiPlan);
}
