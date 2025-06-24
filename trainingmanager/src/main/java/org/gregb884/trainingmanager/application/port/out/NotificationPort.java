package org.gregb884.trainingmanager.application.port.out;

import org.gregb884.trainingmanager.domain.model.User;

public interface NotificationPort {


    void newPlanCreated(String email);
    void traineeDoneWeek(int weekNumber, String trainer);
    void traineeDoneTrainingPlan(String name, String trainer);


}
