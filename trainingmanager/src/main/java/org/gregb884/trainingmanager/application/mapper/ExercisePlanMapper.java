package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.ExercisePlanDto;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.infrastructure.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExercisePlanMapper extends DomainMapper<ExercisePlan, ExercisePlanDto> {

    @Override
    ExercisePlanDto toDto(ExercisePlan domain);

    @Override
    ExercisePlan toDomain(ExercisePlanDto exercisePlanDto);
}
