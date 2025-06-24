package org.gregb884.profilemanager.application.mapper;

import org.gregb884.profilemanager.application.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.domain.model.User;
import org.gregb884.profilemanager.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CreateUserFromDtoMapper extends DomainMapper<User, UserAndTrainerDtoForCreate> {

    @Override
    UserAndTrainerDtoForCreate toDto(User domain);

    @Override
    User toDomain(UserAndTrainerDtoForCreate userAndTrainerDtoForCreate);
}
