package org.gregb884.trainingmanager.domain.service;

import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.domain.model.TrainingPlan;
import org.gregb884.trainingmanager.domain.model.Week;

import java.util.*;

public class WeekFactory {


    private final DayFactory dayFactory;

    public WeekFactory(DayFactory dayFactory) {
        this.dayFactory = dayFactory;
    }

    public Week createWeek(AiTrainingPlan aiPlan, TrainingPlan trainingPlan, Date startDate, List<Integer> dayOffsets, Map<Long, Exercise> exerciseMap) throws Exception {

        Week week = new Week();
        week.setDone(false);
        week.setStartDate(startDate);
        week.setEndDate(DateHelper.calculateEndDate(startDate));
        week.setTrainingPlan(trainingPlan);
        week.setCreatorId(trainingPlan.getCreatorId());

        Set<Day> days = new HashSet<>();

        for (int i = 0; i < aiPlan.getAiDays().size(); i++) {
            AiTrainingPlan.Day aiDay = aiPlan.getAiDays().get(i);
            Date plannedDate = DateHelper.calculateDayDate(startDate, dayOffsets.get(i));
            Day day = dayFactory.createDay(aiDay, plannedDate, week, exerciseMap);
            days.add(day);
        }

        week.setDays(days);
        return week;
    }


}
