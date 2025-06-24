package org.gregb884.aiassist.application.port.out;

import java.util.Date;

public interface TrainingManagerPlanCreatorPort {

    Long createPlanFromAiPlanIdInTrainingManager(long aiPlanId, Date startDate, String days) throws Exception;


}
