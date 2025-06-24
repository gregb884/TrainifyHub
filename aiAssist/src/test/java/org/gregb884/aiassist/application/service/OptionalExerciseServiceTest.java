package org.gregb884.aiassist.application.service;

import org.gregb884.aiassist.domain.model.AiExercise;
import org.gregb884.aiassist.domain.model.OptionalExercise;
import org.gregb884.aiassist.domain.repository.AiExerciseRepositoryPort;
import org.gregb884.aiassist.infrastructure.security.AuthenticatedUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OptionalExerciseServiceTest {

    @Mock
    private AiExerciseRepositoryPort aiExerciseRepositoryPort;

    @Mock
    private AuthenticatedUser authenticatedUser;

    @InjectMocks
    private OptionalExerciseService optionalExerciseService;

    @Test
    void setChose_shouldSelectCorrectOptionalExerciseAndSave() {
        // given
        long userId = 10L;
        long aiExerciseId = 100L;
        long selectedId = 200L;

        OptionalExercise option1 = new OptionalExercise();
        option1.setId(200L);
        option1.setSelected(true);
        OptionalExercise option2 = new OptionalExercise();
        option2.setId(201L);
        option2.setSelected(false);

        AiExercise exercise = new AiExercise();
        exercise.setId(aiExerciseId);
        exercise.setOptionalExerciseList(List.of(option1, option2));

        when(authenticatedUser.getUserId()).thenReturn(userId);
        when(aiExerciseRepositoryPort.findByIdWithCheckUser(aiExerciseId, userId)).thenReturn(Optional.of(exercise));

        // when
        boolean result = optionalExerciseService.setChose(aiExerciseId, selectedId);

        // then
        assertTrue(result);
        assertTrue(option1.isSelected());
        assertFalse(option2.isSelected());
        verify(aiExerciseRepositoryPort).save(exercise);
    }

    @Test
    void setChose_shouldReturnFalse_whenNoMatchingOptionalExercise() {
        // given
        long userId = 10L;
        long aiExerciseId = 100L;
        long selectedId = 999L;

        OptionalExercise option1 = new OptionalExercise();
        option1.setId(200L);
        option1.setSelected(false);
        OptionalExercise option2 = new OptionalExercise();
        option2.setId(201L);
        option2.setSelected(false);

        AiExercise exercise = new AiExercise();
        exercise.setId(aiExerciseId);
        exercise.setOptionalExerciseList(List.of(option1, option2));

        when(authenticatedUser.getUserId()).thenReturn(userId);
        when(aiExerciseRepositoryPort.findByIdWithCheckUser(aiExerciseId, userId)).thenReturn(Optional.of(exercise));

        // when
        boolean result = optionalExerciseService.setChose(aiExerciseId, selectedId);

        // then
        assertFalse(result);
        verify(aiExerciseRepositoryPort, never()).save(any());
    }


    @Test
    void setChose_shouldReturnFalse_whenExerciseNotFound() {
        // given
        long userId = 10L;
        long aiExerciseId = 100L;

        when(authenticatedUser.getUserId()).thenReturn(userId);
        when(aiExerciseRepositoryPort.findByIdWithCheckUser(aiExerciseId, userId)).thenReturn(Optional.empty());

        // when
        boolean result = optionalExerciseService.setChose(aiExerciseId, 999L);

        // then
        assertFalse(result);
        verify(aiExerciseRepositoryPort, never()).save(any());
    }


}