package org.gregb884.trainingmanager.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrainingPlanSummaryDto {

    private String planName;
    private int weekCount;
    private List<ExerciseSummary> exercises;


    @Getter
    @Setter
    public static class ExerciseSummary {
        private String exerciseName;
        private double totalRepetitions;
        private double totalWeight;

    }
}