package org.gregb884.notification.application.mapper;

import org.gregb884.notification.application.dto.UserDto;
import org.gregb884.notification.domain.model.User;
import org.gregb884.notification.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserDtoMapper extends DomainMapper<User, UserDto> {

    @Override
    UserDto toDto(User domain);

    @Override
    User toDomain(UserDto userDto);
}
