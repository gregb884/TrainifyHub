package org.gregb884.trainingmanager.domain.service;

import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;

import java.util.Map;

public class ExercisePlanFactory {

    private final ExerciseSeriesDomainService exerciseSeriesDomainService;

    public ExercisePlanFactory(ExerciseSeriesDomainService exerciseSeriesDomainService) {
        this.exerciseSeriesDomainService = exerciseSeriesDomainService;
    }


    public ExercisePlan create(AiTrainingPlan.Exercise aiExercise, Day day, int order, Map<Long, Exercise> exerciseMap) throws Exception {

        AiTrainingPlan.OptionalExercise selected = aiExercise.getOptionalExerciseList().stream()
                .filter(AiTrainingPlan.OptionalExercise::isSelected)
                .findFirst()
                .orElseThrow(() -> new Exception("Exercise not selected"));

        Exercise exercise = exerciseMap.get(selected.getExerciseId());
        if (exercise == null) throw new Exception("Exercise not found in map");

        ExercisePlan plan = new ExercisePlan();
        plan.setPlannedRepetitions(aiExercise.getRepetitions());
        plan.setPlannedSeries(aiExercise.getPlannedSeries());
        plan.setExerciseOrder(order);
        plan.setExercise(exercise);
        plan.setDay(day);
        plan.setExerciseSeries(exerciseSeriesDomainService.createSeriesForPlan(plan));

        return plan;
    }



}
