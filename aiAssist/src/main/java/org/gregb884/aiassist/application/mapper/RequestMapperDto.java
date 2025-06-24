package org.gregb884.aiassist.application.mapper;

import org.gregb884.aiassist.application.dto.RequestDto;
import org.gregb884.aiassist.application.dto.RequestOnlyIdDto;
import org.gregb884.aiassist.domain.model.Request;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", implementationName = "requestMapperForDto")
public interface RequestMapperDto {


    RequestOnlyIdDto toOnlyIdDto(Request domain);

    Request toDomainOnlyId(RequestOnlyIdDto requestDto);

    RequestDto toRequestDto(Request domain);

    Request toDomainRequest(RequestDto requestDto);
}
