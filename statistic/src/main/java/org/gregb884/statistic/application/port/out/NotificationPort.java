package org.gregb884.statistic.application.port.out;

import org.gregb884.statistic.application.dto.ExerciseNameDto;
import org.gregb884.statistic.application.dto.ExerciseStatsDto;
import org.gregb884.statistic.domain.model.ExerciseStats;

import java.util.Optional;

public interface NotificationPort {

    ExerciseNameDto newExerciseAchievement(long exerciseId) throws Exception;
    ExerciseNameDto send1RmProgressNotification(ExerciseStatsDto exerciseStatsDto, double oldStat) throws Exception;
    ExerciseNameDto sendProgressNotification(ExerciseStatsDto exerciseStatsDto) throws Exception;
    ExerciseNameDto sendRegressNotification(ExerciseStatsDto exerciseStatsDto) throws Exception;
}
