package org.gregb884.statistic.application.port.out;

import org.gregb884.statistic.application.dto.ExerciseNameDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ExerciseNameFetcherPort {


    List<ExerciseNameDto> getExerciseNameList(Page<Long> listExerciseId) throws Exception;
    ExerciseNameDto getExerciseNameById(long id) throws Exception;

}
