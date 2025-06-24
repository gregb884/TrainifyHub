package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.ExerciseNameDto;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.infrastructure.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseNameDtoMapper extends DomainMapper<Exercise, ExerciseNameDto> {


    @Override
    ExerciseNameDto toDto(Exercise domain);

    @Override
    Exercise toDomain(ExerciseNameDto exerciseNameDto);
}
