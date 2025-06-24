package org.gregb884.profilemanager.application.mapper;

import org.gregb884.profilemanager.application.dto.TrainerDto;
import org.gregb884.profilemanager.domain.model.Trainer;
import org.gregb884.profilemanager.shared.DomainMapper;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface TrainerDtoMapper extends DomainMapper<Trainer, TrainerDto> {

    @Override
    TrainerDto toDto(Trainer domain);

    @Override
    Trainer toDomain(TrainerDto trainerDto);
}
