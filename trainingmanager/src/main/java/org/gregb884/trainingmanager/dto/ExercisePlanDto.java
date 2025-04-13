package org.gregb884.trainingmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExercisePlanDto {

    private int plannedRepetitions;
    private double plannedWeight;
    private int plannedSeries;
    private String tempo;
    private String additionalInfo;
    private String returnDescription;
    private int exerciseOrder;



}
