package org.gregb884.statistic.domain.mapper;

import org.gregb884.statistic.domain.dto.ExerciseStatsDtoDetails;
import org.gregb884.statistic.domain.model.ExerciseStats;

public class ExerciseStatsMapper {


    public static ExerciseStatsDtoDetails toDetailsDto(ExerciseStats exerciseStats) {


        ExerciseStatsDtoDetails dto = new ExerciseStatsDtoDetails();

        dto.setId(exerciseStats.getId());
        dto.setExerciseId(exerciseStats.getExerciseId());
        dto.setReps(exerciseStats.getReps());
        dto.setWeight(exerciseStats.getWeight());
        dto.setAddDate(exerciseStats.getAddDate());
        dto.setOneRepMax(exerciseStats.getOneRepMax());

        return dto;
    }




}
