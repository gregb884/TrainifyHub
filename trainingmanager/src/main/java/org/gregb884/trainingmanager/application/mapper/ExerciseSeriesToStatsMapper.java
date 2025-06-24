package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.ExerciseSeriesDto;
import org.gregb884.trainingmanager.application.dto.ExerciseStatsDto;
import org.gregb884.trainingmanager.infrastructure.shared.DomainMapper;
import org.mapstruct.Mapper;

public class ExerciseSeriesToStatsMapper{

        public static ExerciseStatsDto toStatsDto(ExerciseSeriesDto exerciseSeriesDto, long exerciseId) {

        ExerciseStatsDto exerciseStats = new ExerciseStatsDto();

        exerciseStats.setExerciseId(exerciseId);
        exerciseStats.setWeight(exerciseSeriesDto.getTotalWeight());
        exerciseStats.setReps(exerciseSeriesDto.getTotalRepetitions());

        return exerciseStats;
    }

}
