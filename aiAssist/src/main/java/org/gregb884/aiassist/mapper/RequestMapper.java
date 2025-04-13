package org.gregb884.aiassist.mapper;

import org.gregb884.aiassist.dto.RequestDto;
import org.gregb884.aiassist.model.Request;

public class RequestMapper {

    public static RequestDto toDto(Request request) {

        RequestDto dto = new RequestDto();

        dto.setId(request.getId());

        return dto;
    }

}
