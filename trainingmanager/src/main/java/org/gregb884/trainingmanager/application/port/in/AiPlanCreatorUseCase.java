package org.gregb884.trainingmanager.application.port.in;

import java.util.Date;

public interface AiPlanCreatorUseCase {

    Long createAiPlan(Long aiTrainingPlanId, Date startDate , String days) throws Exception;


}
