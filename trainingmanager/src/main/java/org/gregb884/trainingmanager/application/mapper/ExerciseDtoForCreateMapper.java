package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.ExerciseDtoForCreate;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.infrastructure.shared.DomainMapper;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExerciseDtoForCreateMapper extends DomainMapper<Exercise, ExerciseDtoForCreate> {


    @Override
    ExerciseDtoForCreate toDto(Exercise domain);

    @Override
    @Mapping(target = "namePl", ignore = true)
    @Mapping(target = "nameDe", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "descriptionPl", ignore = true)
    @Mapping(target = "descriptionDe", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "videoUrlPl", ignore = true)
    @Mapping(target = "videoUrlDe", ignore = true)
    @Mapping(target = "videoUrl", ignore = true)
    Exercise toDomain(ExerciseDtoForCreate exerciseDtoForCreate);
}
