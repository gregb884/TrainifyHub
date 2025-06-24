package org.gregb884.trainingmanager.domain.service;

import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.model.Week;

import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class DayFactory {


    private final ExercisePlanFactory exercisePlanFactory;

    public DayFactory(ExercisePlanFactory exercisePlanFactory) {
        this.exercisePlanFactory = exercisePlanFactory;
    }

    public Day createDay(AiTrainingPlan.Day aiDay, Date plannedDate, Week parentWeek, Map<Long, Exercise> exerciseMap) throws Exception {

        Day day = new Day();
        day.setCreatorId(2);
        day.setPlannedDate(plannedDate);
        day.setName(DateHelper.dayNameFromDate(plannedDate));
        day.setWeek(parentWeek);

        Set<ExercisePlan> exercisePlans = new HashSet<>();
        int order = 1;

        for (AiTrainingPlan.Exercise aiExercise : aiDay.getAiExercises()) {
            ExercisePlan plan = exercisePlanFactory.create(aiExercise, day, order++, exerciseMap);
            exercisePlans.add(plan);
        }

        day.setExercisePlans(exercisePlans);
        return day;
    }


}
