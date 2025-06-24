package org.gregb884.profilemanager.application.mapper;

import org.gregb884.profilemanager.application.dto.RequestDto;
import org.gregb884.profilemanager.domain.model.Request;
import org.gregb884.profilemanager.shared.DomainMapper;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
@DecoratedWith(RequestDtoMapperDecorator.class)
public interface RequestDtoMapper extends DomainMapper<Request, RequestDto> {


    @Override
    RequestDto toDto(Request domain);

    @Override
    Request toDomain(RequestDto requestDto);
}
