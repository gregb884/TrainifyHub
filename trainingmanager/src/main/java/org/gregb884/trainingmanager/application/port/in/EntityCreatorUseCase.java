package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.domain.model.TrainingPlan;

public interface EntityCreatorUseCase {


    void createNext3WeekForAiPlan(TrainingPlan trainingPlan) throws Exception;


}
