package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.ExerciseDtoForNameList;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.infrastructure.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseDtoForNameListMapper extends DomainMapper<Exercise, ExerciseDtoForNameList> {


    @Override
    ExerciseDtoForNameList toDto(Exercise domain);

    @Override
    Exercise toDomain(ExerciseDtoForNameList exerciseDtoForNameList);
}
