package org.gregb884.aiassist.application.port.in;

import org.gregb884.aiassist.application.dto.AiPlanDto;
import org.gregb884.aiassist.application.dto.RequestCreateDto;
import org.gregb884.aiassist.application.dto.RequestDto;
import org.gregb884.aiassist.application.dto.RequestOnlyIdDto;
import org.gregb884.aiassist.domain.model.Request;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

public interface RequestUseCase {


    Long createTrainingPlanFromPlanAi(Long requestId) throws Exception;

    Long addNewAiRequest(RequestCreateDto request) throws Exception;

    Boolean setNewStartDate(long id, String startDate) throws Exception;

    RequestDto getRequest(long id);

    Boolean isRequestRendering(long id);

    Boolean setRendering(long id, boolean rendering);

    Integer countRequestWithoutPlanQuantity();

    Integer countRequestToAssign();

    List<RequestOnlyIdDto> requestAiToAssignList();

    List<RequestOnlyIdDto> requestAiWithoutPlanList();
}
