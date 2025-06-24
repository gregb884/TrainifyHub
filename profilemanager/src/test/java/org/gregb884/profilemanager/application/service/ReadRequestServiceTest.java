package org.gregb884.profilemanager.application.service;

import org.gregb884.profilemanager.application.dto.RequestDto;
import org.gregb884.profilemanager.application.mapper.RequestDtoMapper;
import org.gregb884.profilemanager.domain.model.Request;
import org.gregb884.profilemanager.domain.repository.RequestRepositoryPort;
import org.gregb884.profilemanager.infrastructure.adapter.out.persistence.jparepository.RequestRepository;
import org.gregb884.profilemanager.infrastructure.security.AuthenticatedUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.hamcrest.core.IsInstanceOf.any;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class RequestServiceTest {

    @InjectMocks
    private ReadRequestService requestService;

    @Mock
    private RequestRepositoryPort requestRepository;

    @Mock
    private AuthenticatedUser authenticatedUser;

    @Mock
    private RequestDtoMapper requestDtoMapper;

    @Test
    void shouldReturnMappedPageOfRequestDtos() throws Exception {
        // given
        long userId = 123L;
        String search = "test";
        int page = 0;
        int size = 2;

        Request request1 = new Request();
        request1.setId(1L);
        Request request2 = new Request();
        request2.setId(2L);

        Page<Request> pageOfRequests = new PageImpl<>(List.of(request1, request2));
        RequestDto dto1 = new RequestDto();
        dto1.setId(1L);
        RequestDto dto2 = new RequestDto();
        dto2.setId(2L);

        Pageable pageable = PageRequest.of(page, size);

        Mockito.when(authenticatedUser.getUserId()).thenReturn(userId);
        Mockito.when(requestRepository.findAllByUserIdAndTrainerIdPage(
                eq(userId),
                eq(search.toLowerCase()),
                eq(PageRequest.of(page, size))
        )).thenReturn(pageOfRequests);

        Mockito.when(requestDtoMapper.toDto(request1)).thenReturn(dto1);
        Mockito.when(requestDtoMapper.toDto(request2)).thenReturn(dto2);

        // when
        Page<RequestDto> result = requestService.myRequest(page, size, search);

        // then
        assertEquals(2, result.getTotalElements());
        assertEquals(1L, result.getContent().get(0).getId());
        assertEquals(2L, result.getContent().get(1).getId());
    }
}