package org.gregb884.trainingmanager.application.port.out;

import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;

public interface AiPlanPort {


    AiTrainingPlan downloadAiPlan(long aiTrainingPlanId) throws Exception;

}
