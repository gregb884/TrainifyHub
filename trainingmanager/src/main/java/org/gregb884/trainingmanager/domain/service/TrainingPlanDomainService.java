package org.gregb884.trainingmanager.domain.service;
import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.domain.dto.TrainingPlanDtoWithDate;
import org.gregb884.trainingmanager.domain.dto.TrainingPlanSummaryDto;
import org.gregb884.trainingmanager.domain.model.*;

import java.util.*;

public class TrainingPlanDomainService {



    private final WeekFactory weekFactory;

    public TrainingPlanDomainService(WeekFactory weekFactory) {
        this.weekFactory = weekFactory;
    }


    public TrainingPlanDtoWithDate getNearestPlannedTrainingDay(TrainingPlan closestTrainingPlan) throws NoSuchElementException {

            Date today = DateHelper.truncateTime(new Date());

            Date date = closestTrainingPlan.getWeeks().stream()
                    .flatMap(week -> week.getDays().stream())
                    .filter(day -> day.getDoneDate() == null)
                    .map(Day::getPlannedDate)
                    .filter(plannedDate -> !DateHelper.truncateTime(plannedDate).before(today))
                    .min(Date::compareTo)
                    .orElseThrow(() -> new NoSuchElementException("No unfinished training days found."));

            return new TrainingPlanDtoWithDate(closestTrainingPlan.getName(), date);
    }


    public TrainingPlanSummaryDto toSummaryDto(TrainingPlan trainingPlan) {

        TrainingPlanSummaryDto dto = new TrainingPlanSummaryDto();
        dto.setPlanName(trainingPlan.getName());
        dto.setWeekCount(trainingPlan.getWeeks() != null ? trainingPlan.getWeeks().size() : 0);

        List<TrainingPlanSummaryDto.ExerciseSummary> exerciseSummaries = new ArrayList<>();
        if (trainingPlan.getWeeks() != null) {
            trainingPlan.getWeeks().forEach(week -> {
                if (week.getDays() != null) {
                    week.getDays().forEach(day -> {
                        if (day.getExercisePlans() != null) {
                            day.getExercisePlans().forEach(exercisePlan -> {
                                TrainingPlanSummaryDto.ExerciseSummary exerciseSummary = new TrainingPlanSummaryDto.ExerciseSummary();
                                exerciseSummary.setExerciseName(exercisePlan.getExercise().getName());

                                OptionalDouble totalRepetitions = exercisePlan.getExerciseSeries().stream()
                                        .mapToInt(ExerciseSeries::getTotalRepetitions)
                                        .average();
                                OptionalDouble totalWeight = exercisePlan.getExerciseSeries().stream()
                                        .mapToDouble(ExerciseSeries::getTotalWeight)
                                        .average();

                                if (totalRepetitions.isEmpty() || totalWeight.isEmpty()) {
                                    totalRepetitions = OptionalDouble.of(0);
                                    totalWeight = OptionalDouble.of(0);
                                }
                                exerciseSummary.setTotalRepetitions(totalRepetitions.getAsDouble());
                                exerciseSummary.setTotalWeight(totalWeight.getAsDouble());

                                exerciseSummaries.add(exerciseSummary);
                            });
                        }
                    });
                }
            });
        }

        dto.setExercises(exerciseSummaries);
        return dto;
    }

    private List<Integer> dayIntegerList (String days){

        return Arrays.stream(days.split(","))
                .map(Integer::parseInt)
                .toList();
    }

    public TrainingPlan createPlanFromAiPlan(AiTrainingPlan aiTrainingPlan, Date startDate , String days, User user, Map<Long, Exercise> exerciseMap) throws Exception {


        List<Integer> integerDayList = dayIntegerList(days);

        TrainingPlan newTrainingPlan = new TrainingPlan();

        newTrainingPlan.setTemplate(false);
        newTrainingPlan.setCreatorId(2);
        assert aiTrainingPlan != null;
        newTrainingPlan.setName(aiTrainingPlan.getPlanName());
        Set<User> users = new HashSet<>();
        users.add(user);
        newTrainingPlan.setUsers(users);

        Week week = weekFactory.createWeek(aiTrainingPlan,newTrainingPlan,startDate,integerDayList,exerciseMap);

        Set<Week> weekSet = new HashSet<>();

        weekSet.add(week);

        newTrainingPlan.setWeeks(weekSet);

        return newTrainingPlan;

    }




}
