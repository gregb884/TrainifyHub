package org.gregb884.statistic.application.mapper;

import org.gregb884.statistic.application.dto.UserDtoHighlights;
import org.gregb884.statistic.domain.model.User;
import org.gregb884.statistic.infrastructure.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserHighlightsMapper extends DomainMapper<User, UserDtoHighlights> {

    @Override
    UserDtoHighlights toDto(User domain);

    @Override
    User toDomain(UserDtoHighlights userDtoHighlights);
}
