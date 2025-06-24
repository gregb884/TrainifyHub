package org.gregb884.aiassist.infrastructure.adapter.out.persistence.repositoryAdapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.domain.model.AiPlan;
import org.gregb884.aiassist.domain.repository.AiPlanRepositoryPort;
import org.gregb884.aiassist.infrastructure.adapter.out.persistence.jpaRepository.JpaAiPlanRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AiPlanRepositoryAdapter implements AiPlanRepositoryPort {

    private final JpaAiPlanRepository jpaAiPlanRepository;

    @Override
    public Optional<AiPlan> findByIdAndUserId(Long userId, Long planId) {
        return jpaAiPlanRepository.findByIdAndUserId(userId, planId);
    }

    @Override
    public AiPlan save(AiPlan aiPlan) {
       return jpaAiPlanRepository.save(aiPlan);
    }

    @Override
    public void delete(AiPlan aiPlan) {
        jpaAiPlanRepository.delete(aiPlan);
    }
}
