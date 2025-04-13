package org.gregb884.trainingmanager.dto;

import org.gregb884.trainingmanager.model.Exercise;

public class ExerciseSimilarity {
    private ExerciseDtoForAi exerciseDtoForAi;
    private double similarity;

    public ExerciseSimilarity(ExerciseDtoForAi exerciseDtoForAi, double similarity) {
        this.exerciseDtoForAi = exerciseDtoForAi;
        this.similarity = similarity;
    }

    public ExerciseDtoForAi getExercise() {
        return exerciseDtoForAi;
    }

    public double getSimilarity() {
        return similarity;
    }
}