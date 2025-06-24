package org.gregb884.trainingmanager.domain.dto;
import java.util.List;


public class TrainingPlanSummaryDto {

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public int getWeekCount() {
        return weekCount;
    }

    public void setWeekCount(int weekCount) {
        this.weekCount = weekCount;
    }

    public List<ExerciseSummary> getExercises() {
        return exercises;
    }

    public void setExercises(List<ExerciseSummary> exercises) {
        this.exercises = exercises;
    }

    private String planName;
    private int weekCount;
    private List<ExerciseSummary> exercises;






    public static class ExerciseSummary {
        private String exerciseName;
        private double totalRepetitions;
        private double totalWeight;

        public String getExerciseName() {
            return exerciseName;
        }

        public void setExerciseName(String exerciseName) {
            this.exerciseName = exerciseName;
        }

        public double getTotalRepetitions() {
            return totalRepetitions;
        }

        public void setTotalRepetitions(double totalRepetitions) {
            this.totalRepetitions = totalRepetitions;
        }

        public double getTotalWeight() {
            return totalWeight;
        }

        public void setTotalWeight(double totalWeight) {
            this.totalWeight = totalWeight;
        }
    }
}