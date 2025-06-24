package org.gregb884.statistic.application.mapper;

import org.gregb884.statistic.application.dto.UserDto;
import org.gregb884.statistic.domain.model.User;
import org.gregb884.statistic.infrastructure.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserDtoMapper extends DomainMapper<User, UserDto> {

    @Override
    UserDto toDto(User domain);

    @Override
    User toDomain(UserDto userDto);
}
