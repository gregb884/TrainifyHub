package org.gregb884.profilemanager.application.port.in;

import org.gregb884.profilemanager.application.dto.RequestDto;
import org.springframework.data.domain.Page;

public interface ReadRequestUseCase {


    Long countNewRequest() throws Exception;

    Page<RequestDto> myRequest(int page , int size , String search) throws Exception;




}
