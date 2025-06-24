package org.gregb884.statistic.application.port.in;

import org.gregb884.statistic.application.dto.ExerciseNameDto;
import org.gregb884.statistic.application.dto.UserDtoHighlights;

public interface UserHighlightsUseCase {

    void setUser1Rm(ExerciseNameDto exerciseNameDto);
    void setUserProgress(ExerciseNameDto exerciseNameDto);
    void setUserRegress(ExerciseNameDto exerciseNameDto);
    void setUserNewExercise(ExerciseNameDto exerciseNameDto);
    UserDtoHighlights getHighlights();

}
