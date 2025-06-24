package org.gregb884.aiassist.application.mapper;

import org.gregb884.aiassist.application.dto.AiPlanDto;
import org.gregb884.aiassist.domain.model.AiPlan;
import org.gregb884.aiassist.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AiPlanDtoMapper extends DomainMapper<AiPlan, AiPlanDto> {

    @Override
    AiPlanDto toDto(AiPlan domain);

    @Override
    AiPlan toDomain(AiPlanDto aiPlanDto);
}
