package org.gregb884.profilemanager.application.mapper;

import org.gregb884.profilemanager.application.dto.UserDto;
import org.gregb884.profilemanager.domain.model.User;
import org.gregb884.profilemanager.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EditUserProfileMapper extends DomainMapper<User, UserDto> {

    @Override
    UserDto toDto(User domain);

    @Override
    User toDomain(UserDto userDto);
}
