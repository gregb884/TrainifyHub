package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.DayDto;
import org.gregb884.trainingmanager.domain.model.Day;

import java.util.Optional;

public interface DayCreateUseCase {


    boolean create(long weekId, DayDto dayDto);
    Optional<Day> getDay(long id);


}
