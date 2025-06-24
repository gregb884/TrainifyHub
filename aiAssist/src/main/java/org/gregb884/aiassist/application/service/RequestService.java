package org.gregb884.aiassist.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.gregb884.aiassist.application.dto.RequestCreateDto;
import org.gregb884.aiassist.application.dto.RequestDto;
import org.gregb884.aiassist.application.dto.RequestOnlyIdDto;
import org.gregb884.aiassist.application.mapper.RequestMapperDto;
import org.gregb884.aiassist.application.port.in.RequestUseCase;
import org.gregb884.aiassist.application.port.out.CoinCheckerPort;
import org.gregb884.aiassist.application.port.out.TrainingManagerPlanCreatorPort;
import org.gregb884.aiassist.application.port.out.TrainingPlanSummaryFetcher;
import org.gregb884.aiassist.domain.model.Request;
import org.gregb884.aiassist.domain.repository.RequestRepositoryPort;
import org.gregb884.aiassist.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RequestService implements RequestUseCase {


    private final AuthenticatedUser authenticatedUser;
    private final RequestRepositoryPort requestRepositoryPort;
    private final RequestMapperDto requestMapper;
    private final CoinCheckerPort coinCheckerPort;
    private final TrainingPlanSummaryFetcher trainingPlanSummaryFetcher;
    private final TrainingManagerPlanCreatorPort trainingManagerPlanCreatorPort;



    @Override
    public Long createTrainingPlanFromPlanAi(Long requestId) throws Exception {

        Optional<Request> requestOpt = requestRepositoryPort.findByIdAndUserId(requestId, authenticatedUser.getUserId());

        if (requestOpt.isEmpty()) {
            throw new Exception("Could not find request with id " + requestId);
        }

        Request request = requestOpt.get();

        try {
            Long planId = trainingManagerPlanCreatorPort.createPlanFromAiPlanIdInTrainingManager(
                    request.getAiPlanId(),
                    request.getStartDate(),
                    request.getDays()
            );

            request.setGeneratedPlanId(planId);
            requestRepositoryPort.save(request);

            return planId;

        } catch (Exception e) {
            log.error(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    public Boolean setNewStartDate(long id, String startDateStr) throws Exception {

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = formatter.parse(startDateStr);

        Optional<Request> request = requestRepositoryPort.findByIdAndUserId(id, authenticatedUser.getUserId());

        if (request.isPresent()) {

            request.get().setStartDate(startDate);

            requestRepositoryPort.save(request.get());

            return true;
        }

        return false;
    }

    @Override
    public RequestDto getRequest(long id) {

        Optional<Request> request = requestRepositoryPort.findByIdAndUserId(id, authenticatedUser.getUserId());

        return request.map(requestMapper::toRequestDto).orElse(null);
    }

    @Override
    public List<RequestOnlyIdDto> requestAiWithoutPlanList() {

        Optional<List<Request>> requestList = requestRepositoryPort.ListUserIdWithoutPlan(authenticatedUser.getUserId());

        return requestList.map(requests -> requests.stream().map(requestMapper::toOnlyIdDto).toList()).orElse(null);

    }



    @Override
    public Integer countRequestToAssign() {

        return requestRepositoryPort.countByUserIdToAssign(authenticatedUser.getUserId());

    }

    @Override
    public List<RequestOnlyIdDto> requestAiToAssignList() {

        Optional<List<Request>> requestList = requestRepositoryPort.ListUserIdToAssign(authenticatedUser.getUserId());

        return requestList.map(requests -> requests.stream().map(requestMapper::toOnlyIdDto).toList()).orElse(null);
    }


    @Override
    public Integer countRequestWithoutPlanQuantity() {

        return requestRepositoryPort.countByUserIdRequestWithAction(authenticatedUser.getUserId());

    }

    public void save(Request request) {

        if (request.getUserId() == authenticatedUser.getUserId()) {

            requestRepositoryPort.save(request);
        }

    }

    @Override
    public Boolean isRequestRendering(long id) {

        Optional<Request> request = requestRepositoryPort.findByIdAndUserId(id, authenticatedUser.getUserId());

        return request.map(Request::getIsRendering).orElse(false);

    }

    @Override
    public Boolean setRendering(long id, boolean rendering) {

        Optional<Request> request = requestRepositoryPort.findByIdAndUserId(id, authenticatedUser.getUserId());

        if (request.isPresent()) {
            request.get().setIsRendering(rendering);
            requestRepositoryPort.save(request.get());
            return true;
        } else return false;

    }

    @Override
    public Long addNewAiRequest(RequestCreateDto request) throws Exception {

            coinCheckerPort.userHasCoin();

            Request savedRequest = addRequestToRepository(request);

            if (!(savedRequest.getLastPlanId() == 0)){
                try {
                   String oldTrainingPlanSummary = trainingPlanSummaryFetcher.fetchOldTrainingPlan(savedRequest.getLastPlanId());
                   savedRequest.setLastPlanDescription(oldTrainingPlanSummary);
                } catch (Exception e){
                    savedRequest.setLastPlanDescription("Could not fetch old training plan");
                }
                requestRepositoryPort.save(savedRequest);
            }

        return savedRequest.getId();
    }


    public Request addRequestToRepository(RequestCreateDto request) {

        Request newRequest = new Request();

        newRequest.setGoal(request.getGoal());
        newRequest.setExperience(request.getExperience());
        newRequest.setEquipment(request.getEquipment());
        newRequest.setDays(request.getDays());
        newRequest.setPreferences(request.getPreferences());
        newRequest.setSessionTime(request.getSessionTime());
        newRequest.setLastPlanId(request.getLastPlanId());
        newRequest.setUserId(authenticatedUser.getUserId());
        newRequest.setStartDate(request.getStartDate());
        newRequest.setPreviousOk(request.isPreviousOk());
        newRequest.setPrimaryFocus(request.getPrimaryFocus());

        return requestRepositoryPort.save(newRequest);
    }


    public void deleteRequest(long id) {

        Optional<Request> requestToDelete = requestRepositoryPort.findByIdAndUserId(id, authenticatedUser.getUserId());

        requestToDelete.ifPresent(requestRepositoryPort::delete);
    }

    public void setReadyAiPlan(long requestId, long planId) {

        Optional<Request> request = requestRepositoryPort.findByIdAndUserId(requestId, authenticatedUser.getUserId());

        if (request.isPresent()) {
            request.get().setAiPlanId(planId);
            requestRepositoryPort.save(request.get());
        }
    }

    public void setAiAnswer(long requestId , String aiAnswer){

        Optional<Request> request = requestRepositoryPort.findByIdAndUserId(requestId, authenticatedUser.getUserId());

        if (request.isPresent()) {

            request.get().setAiAnswer(aiAnswer);

            requestRepositoryPort.save(request.get());
        }

    }
}