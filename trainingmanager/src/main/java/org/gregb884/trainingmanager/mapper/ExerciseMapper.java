package org.gregb884.trainingmanager.mapper;

import org.gregb884.trainingmanager.dto.*;
import org.gregb884.trainingmanager.model.Exercise;
import org.gregb884.trainingmanager.model.ExerciseSeries;

public class ExerciseMapper {

    public static ExerciseDto toDto(Exercise exercise) {

        ExerciseDto exerciseDto = new ExerciseDto();

        exerciseDto.setId(exercise.getId());
        exerciseDto.setName(exercise.getName());
        exerciseDto.setNamePl(exercise.getNamePl());
        exerciseDto.setNameDe(exercise.getNameDe());
        exerciseDto.setImageUrl(exercise.getImageUrl());
        exerciseDto.setVideoUrl(exercise.getVideoUrl());
        exerciseDto.setVideoUrlPl(exercise.getVideoUrlPl());
        exerciseDto.setVideoUrlDe(exercise.getVideoUrlDe());
        exerciseDto.setDescription(exercise.getDescription());
        exerciseDto.setDescriptionPl(exercise.getDescriptionPl());
        exerciseDto.setDescriptionDe(exercise.getDescriptionDe());
        exerciseDto.setMainMuscle(exercise.getMainMuscle());
        exerciseDto.setCreatorId(exercise.getCreatorId());
        exerciseDto.setIsPrivate(exercise.getIsPrivate());


        return exerciseDto;
    }


    public static ExerciseNameDto toNameDto(Exercise exercise) {

        ExerciseNameDto exerciseNameDto = new ExerciseNameDto();

        exerciseNameDto.setName(exercise.getName());
        exerciseNameDto.setNamePl(exercise.getNamePl());
        exerciseNameDto.setNameDe(exercise.getNameDe());

        return exerciseNameDto;
    }

    public static ExerciseDtoForNameList toNameListDto(Exercise exercise) {

        ExerciseDtoForNameList exerciseDtoForNameList = new ExerciseDtoForNameList();

        exerciseDtoForNameList.setId(exercise.getId());
        exerciseDtoForNameList.setName(exercise.getName());
        exerciseDtoForNameList.setNamePl(exercise.getNamePl());
        exerciseDtoForNameList.setNameDe(exercise.getNameDe());

        return exerciseDtoForNameList;

    }


    public static ExerciseStatsDto toStatsDto(ExerciseSeriesDto exerciseSeriesDto, long exerciseId) {

       ExerciseStatsDto exerciseStats = new ExerciseStatsDto();

       exerciseStats.setExerciseId(exerciseId);
       exerciseStats.setWeight(exerciseSeriesDto.getTotalWeight());
       exerciseStats.setReps(exerciseSeriesDto.getTotalRepetitions());


        return exerciseStats;

    }

}
