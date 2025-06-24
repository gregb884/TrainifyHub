package org.gregb884.statistic.application.port.in;

import org.gregb884.statistic.application.dto.ExerciseNameDto;
import org.gregb884.statistic.application.dto.ExerciseStatsDto;
import org.gregb884.statistic.domain.dto.ExerciseStatsDtoDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExerciseStatisticUseCase {


    List<ExerciseStatsDtoDetails> getExerciseDetails(long exerciseId) throws Exception;
    Page<ExerciseNameDto> getExerciseNames(Pageable pageable) throws Exception;
    Double calculate1Rm(int exerciseId);
    void save(ExerciseStatsDto exerciseStatsDto) throws Exception;

}
