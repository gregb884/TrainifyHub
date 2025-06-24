package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.domain.model.WorkoutPlans;

import java.util.List;

public interface WorkoutPlansUseCase {


    List<WorkoutPlans> getAllPlans();
    void addNewPlan(WorkoutPlans workoutPlans) throws Exception;
    WorkoutPlans getPlan(long id);



}
