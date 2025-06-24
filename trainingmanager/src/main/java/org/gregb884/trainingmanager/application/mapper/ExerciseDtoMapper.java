package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.ExerciseDto;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.infrastructure.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseDtoMapper extends DomainMapper<Exercise, ExerciseDto> {


    @Override
    ExerciseDto toDto(Exercise domain);

    @Override
    Exercise toDomain(ExerciseDto exerciseDto);
}
