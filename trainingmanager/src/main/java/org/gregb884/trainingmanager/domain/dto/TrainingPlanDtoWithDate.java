package org.gregb884.trainingmanager.domain.dto;

import java.util.Date;

public class TrainingPlanDtoWithDate {

    private String name;
    private Date startDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }


    public TrainingPlanDtoWithDate(String name, Date startDate) {
        this.name = name;
        this.startDate = startDate;
    }

    public TrainingPlanDtoWithDate() {
    }
}
