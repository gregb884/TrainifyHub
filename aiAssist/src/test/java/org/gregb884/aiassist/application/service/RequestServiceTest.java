package org.gregb884.aiassist.application.service;

import org.gregb884.aiassist.application.dto.RequestCreateDto;
import org.gregb884.aiassist.application.dto.RequestDto;
import org.gregb884.aiassist.application.mapper.RequestMapperDto;
import org.gregb884.aiassist.application.port.out.CoinCheckerPort;
import org.gregb884.aiassist.application.port.out.TrainingManagerPlanCreatorPort;
import org.gregb884.aiassist.application.port.out.TrainingPlanSummaryFetcher;
import org.gregb884.aiassist.domain.model.Request;
import org.gregb884.aiassist.domain.repository.RequestRepositoryPort;
import org.gregb884.aiassist.infrastructure.security.AuthenticatedUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RequestServiceTest {

    @InjectMocks
    private RequestService requestService;

    @Mock
    private AuthenticatedUser authenticatedUser;

    @Mock
    private RequestMapperDto requestMapper;

    @Mock
    private TrainingPlanSummaryFetcher trainingPlanSummaryFetcher;

    @Mock
    private CoinCheckerPort coinCheckerPort;

    @Mock
    private RequestRepositoryPort requestRepositoryPort;

    @Mock
    private TrainingManagerPlanCreatorPort trainingManagerPlanCreatorPort;

    @Test
    void shouldCreateTrainingPlanFromAiPlan() throws Exception {
        // given
        long userId = 101L;
        long requestId = 1L;
        long aiPlanId = 200L;
        long generatedPlanId = 999L;
        String days = "3";
        Date startDate = new Date();

        Request request = new Request();
        request.setId(requestId);
        request.setAiPlanId(aiPlanId);
        request.setStartDate(startDate);
        request.setDays(days);

        when(authenticatedUser.getUserId()).thenReturn(userId);
        when(requestRepositoryPort.findByIdAndUserId(requestId, userId)).thenReturn(Optional.of(request));
        when(trainingManagerPlanCreatorPort.createPlanFromAiPlanIdInTrainingManager(aiPlanId, startDate, days))
                .thenReturn(generatedPlanId);

        // when
        Long result = requestService.createTrainingPlanFromPlanAi(requestId);

        // then
        assertEquals(generatedPlanId, result);
        assertEquals(generatedPlanId, request.getGeneratedPlanId());
        verify(requestRepositoryPort).save(request);
    }


    @Test
    void shouldThrowExceptionWhenRequestNotFound() {
        // given
        long requestId = 1L;
        long userId = 101L;

        when(authenticatedUser.getUserId()).thenReturn(userId);
        when(requestRepositoryPort.findByIdAndUserId(requestId, userId)).thenReturn(Optional.empty());

        // when + then
        Exception exception = assertThrows(Exception.class, () -> {
            requestService.createTrainingPlanFromPlanAi(requestId);
        });

        assertTrue(exception.getMessage().contains("Could not find request with id"));
    }

    @Test
    void shouldThrowExceptionWhenPlanCreationFails() throws Exception {
        // given
        long userId = 101L;
        long requestId = 1L;
        long aiPlanId = 200L;
        String days = "4";
        Date startDate = new Date();

        Request request = new Request();
        request.setId(requestId);
        request.setAiPlanId(aiPlanId);
        request.setStartDate(startDate);
        request.setDays(days);

        when(authenticatedUser.getUserId()).thenReturn(userId);
        when(requestRepositoryPort.findByIdAndUserId(requestId, userId)).thenReturn(Optional.of(request));
        when(trainingManagerPlanCreatorPort.createPlanFromAiPlanIdInTrainingManager(aiPlanId, startDate, days))
                .thenThrow(new RuntimeException("Creation failed"));

        // when
        Exception exception = assertThrows(Exception.class, () -> {
            requestService.createTrainingPlanFromPlanAi(requestId);
        });

        // then
        assertTrue(exception.getMessage().contains("Creation failed"));
        verify(requestRepositoryPort, never()).save(any());
    }

    @Test
    void testSetNewStartDate_success() throws Exception {
        // given
        long requestId = 1L;
        String startDateStr = "2025-06-01";
        Date parsedDate = new SimpleDateFormat("yyyy-MM-dd").parse(startDateStr);

        Request mockRequest = new Request();
        mockRequest.setUserId(100L);  // jakikolwiek ID

        when(authenticatedUser.getUserId()).thenReturn(100L);
        when(requestRepositoryPort.findByIdAndUserId(requestId, 100L)).thenReturn(Optional.of(mockRequest));

        // when
        Boolean result = requestService.setNewStartDate(requestId, startDateStr);

        // then
        assertTrue(result);
        assertEquals(parsedDate, mockRequest.getStartDate());
        verify(requestRepositoryPort).save(mockRequest);
    }


    @Test
    void testSetNewStartDate_notFound() throws Exception {
        // given
        long requestId = 1L;
        String startDateStr = "2025-06-01";

        when(authenticatedUser.getUserId()).thenReturn(100L);
        when(requestRepositoryPort.findByIdAndUserId(requestId, 100L)).thenReturn(Optional.empty());

        // when
        Boolean result = requestService.setNewStartDate(requestId, startDateStr);

        // then
        assertFalse(result);
        verify(requestRepositoryPort, never()).save(any());
    }


    @Test
    void testGetRequest_found() {
        // given
        long requestId = 1L;
        long userId = 42L;
        Request request = new Request();
        request.setId(requestId);
        request.setUserId(userId);

        RequestDto expectedDto = new RequestDto();
        expectedDto.setId(requestId);

        when(authenticatedUser.getUserId()).thenReturn(userId);
        when(requestRepositoryPort.findByIdAndUserId(requestId, userId)).thenReturn(Optional.of(request));
        when(requestMapper.toRequestDto(request)).thenReturn(expectedDto);

        // when
        RequestDto result = requestService.getRequest(requestId);

        // then
        assertNotNull(result);
        assertEquals(expectedDto.getId(), result.getId());
        verify(requestMapper).toRequestDto(request);
    }

    @Test
    void testGetRequest_notFound() {
        // given
        long requestId = 1L;
        long userId = 42L;

        when(authenticatedUser.getUserId()).thenReturn(userId);
        when(requestRepositoryPort.findByIdAndUserId(requestId, userId)).thenReturn(Optional.empty());

        // when
        RequestDto result = requestService.getRequest(requestId);

        // then
        assertNull(result);
        verify(requestMapper, never()).toRequestDto(any());
    }


    @Test
    void testAddNewAiRequest_noLastPlanId_success() throws Exception {
        // given
        long userId = 123L;
        RequestCreateDto dto = new RequestCreateDto();
        dto.setLastPlanId(0L);
        Request request = new Request();
        request.setId(1L);
        request.setLastPlanId(0L);
        request.setUserId(userId);

        when(authenticatedUser.getUserId()).thenReturn(userId);
        doNothing().when(coinCheckerPort).userHasCoin();
        when(requestRepositoryPort.save(any(Request.class))).thenReturn(request);

        // when
        Long result = requestService.addNewAiRequest(dto);

        // then
        assertEquals(1L, result);
        verify(requestRepositoryPort, times(1)).save(any());
        verify(trainingPlanSummaryFetcher, never()).fetchOldTrainingPlan(anyLong());
    }

    @Test
    void addNewAiRequest_shouldFetchAndSetDescription_whenLastPlanIdExists() throws Exception {
        // given
        long userId = 1L;
        long expectedId = 321L;

        RequestCreateDto createDto = new RequestCreateDto();
        createDto.setLastPlanId(50L);

        Request savedRequest = new Request();
        savedRequest.setId(expectedId);
        savedRequest.setLastPlanId(50L);
        savedRequest.setUserId(userId);

        when(authenticatedUser.getUserId()).thenReturn(userId);
        doNothing().when(coinCheckerPort).userHasCoin();
        when(requestRepositoryPort.save(any(Request.class))).thenReturn(savedRequest);
        when(trainingPlanSummaryFetcher.fetchOldTrainingPlan(50L)).thenReturn("old plan");

        // when
        Long result = requestService.addNewAiRequest(createDto);

        // then
        assertEquals(expectedId, result);
        verify(trainingPlanSummaryFetcher).fetchOldTrainingPlan(50L);
        verify(requestRepositoryPort, times(2)).save(any()); // initial + with description
    }

    @Test
    void addNewAiRequest_shouldSetFallbackDescription_whenSummaryFetchFails() throws Exception {
        // given
        long userId = 1L;
        long expectedId = 555L;

        RequestCreateDto createDto = new RequestCreateDto();
        createDto.setLastPlanId(777L);

        Request savedRequest = new Request();
        savedRequest.setId(expectedId);
        savedRequest.setLastPlanId(777L);
        savedRequest.setUserId(userId);

        when(authenticatedUser.getUserId()).thenReturn(userId);
        doNothing().when(coinCheckerPort).userHasCoin();
        when(requestRepositoryPort.save(any(Request.class))).thenReturn(savedRequest);
        when(trainingPlanSummaryFetcher.fetchOldTrainingPlan(777L)).thenThrow(new RuntimeException("boom"));

        // when
        Long result = requestService.addNewAiRequest(createDto);

        // then
        assertEquals(expectedId, result);
        verify(trainingPlanSummaryFetcher).fetchOldTrainingPlan(777L);
        verify(requestRepositoryPort, times(2)).save(any()); // initial + fallback
    }


}