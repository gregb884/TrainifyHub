package org.gregb884.aiassist.application.port.in;

import org.gregb884.aiassist.application.dto.AiPlanDto;
import org.gregb884.aiassist.domain.model.AiPlan;

import java.util.Optional;

public interface AiPlanUseCase {

    Optional<AiPlan> getById(long id);

    void createNewAiPlanFromRequest(long id) throws Exception;

}
