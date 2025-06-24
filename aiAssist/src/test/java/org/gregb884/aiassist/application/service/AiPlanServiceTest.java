package org.gregb884.aiassist.application.service;

import org.gregb884.aiassist.application.mapper.AiPlanDtoMapper;
import org.gregb884.aiassist.application.mapper.RequestMapperDto;
import org.gregb884.aiassist.application.port.out.*;
import org.gregb884.aiassist.domain.model.AiDay;
import org.gregb884.aiassist.domain.model.AiExercise;
import org.gregb884.aiassist.domain.model.AiPlan;
import org.gregb884.aiassist.domain.model.OptionalExercise;
import org.gregb884.aiassist.domain.repository.AiPlanRepositoryPort;
import org.gregb884.aiassist.infrastructure.security.AuthenticatedUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiPlanServiceTest {


    @Mock
    private AuthenticatedUser authenticatedUser;
    @Mock private OptionalExerciseFetcherPort optionalExerciseFetcherPort;
    @Mock private TranslatorPort translatorPort;
    @Mock private AiPlanGeneratorPort aiPlanGeneratorPort;
    @Mock private ExerciseForMuscleFetcherPort exerciseForMuscleFetcherPort;
    @Mock private RequestService requestService;
    @Mock private CoinCheckerPort coinCheckerPort;
    @Mock private AiPlanRepositoryPort aiPlanRepositoryPort;
    @Mock private RequestMapperDto requestMapperDto;
    @Mock private NotificationPort notificationPort;
    @Mock private AiPlanDtoMapper aiPlanDtoMapper;

    @InjectMocks
    private AiPlanService aiPlanService;


    @Test
    void validateAiPlan_shouldThrowException_whenAiDaysIsNull() {
        AiPlan aiPlan = new AiPlan();
        aiPlan.setAiDays(null);

        Exception ex = assertThrows(Exception.class, () -> aiPlanService.validateAiPlan(aiPlan));
        assertEquals("Plan has no days.", ex.getMessage());
    }

    @Test
    void validateAiPlan_shouldThrowException_whenAiDaysIsEmpty() {
        AiPlan aiPlan = new AiPlan();
        aiPlan.setAiDays(Collections.emptyList());

        Exception ex = assertThrows(Exception.class, () -> aiPlanService.validateAiPlan(aiPlan));
        assertEquals("Plan has no days.", ex.getMessage());
    }



    @Test
    void validateAiPlan_shouldPass_whenAllExercisesHaveOptionalExercises() {
        OptionalExercise optionalExercise = new OptionalExercise();

        AiExercise exercise = new AiExercise();
        exercise.setId(1L);
        exercise.setOptionalExerciseList(List.of(optionalExercise));

        AiDay day = new AiDay();
        day.setAiExercises(List.of(exercise));

        AiPlan aiPlan = new AiPlan();
        aiPlan.setAiDays(List.of(day));

        assertDoesNotThrow(() -> aiPlanService.validateAiPlan(aiPlan));
    }

    @Test
    void validateAiPlan_shouldThrowException_whenNoDays() {
        // given
        AiPlan emptyPlan = new AiPlan();
        emptyPlan.setAiDays(Collections.emptyList());

        // expect
        Exception exception = assertThrows(Exception.class, () ->
                aiPlanService.validateAiPlan(emptyPlan)
        );

        assertEquals("Plan has no days.", exception.getMessage());
    }

    @Test
    void validateAiPlan_shouldThrowException_whenExerciseHasNoOptionalExercises() {
        // given
        AiExercise ex = new AiExercise();
        ex.setId(1L);
        ex.setOptionalExerciseList(Collections.emptyList());

        AiDay day = new AiDay();
        day.setAiExercises(List.of(ex));

        AiPlan aiPlan = new AiPlan();
        aiPlan.setAiDays(List.of(day));

        // expect
        Exception exception = assertThrows(Exception.class, () ->
                aiPlanService.validateAiPlan(aiPlan)
        );

        assertEquals("Exercise 1 has no optional exercises.", exception.getMessage());
    }

    @Test
    void validateAiPlan_shouldPass_whenValidPlan() {
        AiExercise ex = new AiExercise();
        ex.setId(1L);
        ex.setOptionalExerciseList(List.of(new OptionalExercise()));

        AiDay day = new AiDay();
        day.setAiExercises(List.of(ex));

        AiPlan aiPlan = new AiPlan();
        aiPlan.setAiDays(List.of(day));

        assertDoesNotThrow(() -> aiPlanService.validateAiPlan(aiPlan));
    }

    @Test
    void createNewAiPlanFromRequest_shouldFailIfRequestIsNull() throws Exception {
        // given
        when(requestService.getRequest(99L)).thenReturn(null);

        // when
        aiPlanService.createNewAiPlanFromRequest(99L);

        // then: no exception, no calls
        verify(coinCheckerPort, never()).userHasCoin();
        verify(aiPlanGeneratorPort, never()).sendPrompt(any());
    }


}