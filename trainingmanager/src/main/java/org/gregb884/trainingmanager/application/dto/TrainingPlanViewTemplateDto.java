package org.gregb884.trainingmanager.application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainingPlanViewTemplateDto {
    public Long id;
    public String name;
    public int trainingDays;
}
