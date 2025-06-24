package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.ExerciseDtoForCreate;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;

public class ExerciseDtoMapperDecorator implements ExerciseDtoForCreateMapper {

    private final AuthenticatedUser authenticatedUser;
    private final ExerciseDtoForCreateMapper delegate;

    public ExerciseDtoMapperDecorator(ExerciseDtoForCreateMapper delegate,
                                      AuthenticatedUser authenticatedUser) {
        this.delegate = delegate;
        this.authenticatedUser = authenticatedUser;
    }


    @Override
    public ExerciseDtoForCreate toDto(Exercise domain) {
        return null;
    }

    @Override
    public Exercise toDomain(ExerciseDtoForCreate exerciseDtoForCreate) {

        Exercise exercise = delegate.toDomain(exerciseDtoForCreate);

        String lang = authenticatedUser.getLang();

        switch (lang){

            case "en":
              exercise.setName(exerciseDtoForCreate.getName());
              exercise.setDescription(exerciseDtoForCreate.getDescription());
              exercise.setVideoUrl(exerciseDtoForCreate.getVideoUrl());
              break;

            case "de":
                exercise.setNameDe(exerciseDtoForCreate.getName());
                exercise.setDescriptionDe(exerciseDtoForCreate.getDescription());
                exercise.setVideoUrlDe(exerciseDtoForCreate.getVideoUrl());
                break;
            case "pl":
                exercise.setNamePl(exerciseDtoForCreate.getName());
                exercise.setDescriptionPl(exerciseDtoForCreate.getDescription());
                exercise.setVideoUrlPl(exerciseDtoForCreate.getVideoUrl());
                break;
        }
        return exercise;

    }
}
