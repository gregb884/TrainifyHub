package org.gregb884.profilemanager.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.dto.RequestDto;
import org.gregb884.profilemanager.application.mapper.RequestDtoMapper;
import org.gregb884.profilemanager.application.port.in.ReadRequestUseCase;
import org.gregb884.profilemanager.domain.model.Request;
import org.gregb884.profilemanager.domain.repository.RequestRepositoryPort;
import org.gregb884.profilemanager.infrastructure.security.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadRequestService implements ReadRequestUseCase {

    private final AuthenticatedUser authenticatedUser;
    private final RequestRepositoryPort requestRepository;
    @Qualifier("requestDtoMapperDecorator")
    private final RequestDtoMapper requestDtoMapper;


    @Override
    public Long countNewRequest() throws Exception {

        if (!authenticatedUser.getUserRole().equals("ROLE_TRAINER")){

            throw new Exception("User does not have role TRAINER");
        }

        return requestRepository.countNewRequest(authenticatedUser.getUserId());

    }


    @Override
    public Page<RequestDto> myRequest(int page , int size , String search) throws Exception {

        try {

            long userId = authenticatedUser.getUserId();

            String searchToLowerCase = search.toLowerCase();

            Pageable pageable = PageRequest.of(page, size);

            Page<Request> requests = requestRepository.findAllByUserIdAndTrainerIdPage(userId,searchToLowerCase,pageable);

            return requests.map(requestDtoMapper::toDto);

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }


    }


}
