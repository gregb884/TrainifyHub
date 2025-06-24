package org.gregb884.profilemanager.application.mapper;

import org.gregb884.profilemanager.application.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.domain.model.Trainer;
import org.gregb884.profilemanager.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CreateTrainerFromDtoMapper extends DomainMapper<Trainer, UserAndTrainerDtoForCreate> {

    @Override
    UserAndTrainerDtoForCreate toDto(Trainer domain);

    @Override
    Trainer toDomain(UserAndTrainerDtoForCreate userAndTrainerDtoForCreate);
}
