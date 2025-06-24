package org.gregb884.profilemanager.application.mapper;

import org.gregb884.profilemanager.application.dto.RequestDto;
import org.gregb884.profilemanager.domain.model.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public abstract class RequestDtoMapperDecorator implements RequestDtoMapper {

    @Autowired
    @Qualifier("delegate")
    private RequestDtoMapper delegate;

    @Override
    public RequestDto toDto(Request domain) {
        RequestDto dto = delegate.toDto(domain);

        if (domain.getTrainer() != null) {
            dto.setTrainerId(domain.getTrainer().getId());
            dto.setTrainerFirstName(domain.getTrainer().getFirstName());
            dto.setTrainerLastName(domain.getTrainer().getLastName());
        }

        return dto;
    }

}
