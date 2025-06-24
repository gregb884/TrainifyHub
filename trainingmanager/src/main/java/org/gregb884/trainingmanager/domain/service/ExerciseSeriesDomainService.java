package org.gregb884.trainingmanager.domain.service;

import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;

import java.util.HashSet;
import java.util.Set;

public class ExerciseSeriesDomainService {


    public Set<ExerciseSeries> createSeriesForPlan(ExercisePlan exercisePlan) {

        Set<ExerciseSeries> exerciseSeriesSet = new HashSet<ExerciseSeries>();

        for (int i = 0;i < exercisePlan.getPlannedSeries();i++){

            ExerciseSeries exerciseSeries = new ExerciseSeries();
            exerciseSeries.setExercisePlan(exercisePlan);
            exerciseSeriesSet.add(exerciseSeries);
        }
        return exerciseSeriesSet;
    }


}
