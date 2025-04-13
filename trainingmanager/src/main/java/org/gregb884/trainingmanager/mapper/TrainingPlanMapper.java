package org.gregb884.trainingmanager.mapper;
import org.gregb884.trainingmanager.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainingPlanMapper {


    @Mapping(target = "id", ignore = true)
    TrainingPlan clonePlan(TrainingPlan trainingPlan);

    @Mapping(target = "id", ignore = true)
    Week cloneWeek(Week week);

    @Mapping(target = "id", ignore = true)
    Day cloneDay(Day day);

    @Mapping(target = "id", ignore = true)
    ExercisePlan cloneExercisePlan(ExercisePlan exercisePlan);

    @Mapping(target = "id", ignore = true)
    ExerciseSeries cloneExerciseSeries(ExerciseSeries exerciseSeries);



}
