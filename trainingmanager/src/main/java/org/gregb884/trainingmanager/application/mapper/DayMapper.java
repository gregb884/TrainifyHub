package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.DayDto;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Week;
import org.gregb884.trainingmanager.infrastructure.shared.DomainMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DayMapper extends DomainMapper<Day, DayDto> {


    @Override
    DayDto toDto(Day domain);

    @Override
    Day toDomain(DayDto dayDto);

    @Mapping(target = "week", source = "week")
    @Mapping(target = "creatorId", source = "creatorId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "doneDate", ignore = true)
    @Mapping(target = "exercisePlans", ignore = true)
    Day toDomainWithWeekAndCreatorId(DayDto dayDto , Week week , Long creatorId);


}
