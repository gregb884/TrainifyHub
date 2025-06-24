package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.AssignPlanDto;

public interface AssignTrainingPlanUseCase {

    Long assignPlan(long planId, String userEmail, AssignPlanDto assignPlanDto, boolean paidPlans) throws Exception;



}
