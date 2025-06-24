package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.DayDto;
import org.gregb884.trainingmanager.domain.model.Day;

import java.util.Optional;

public interface DayUseCase {


    Optional<Day> getDayWithAccessControl(long id) throws Exception;
    boolean edit(long dayId, DayDto dayDto);
    boolean delete(long id);
    boolean setDone(long id) throws Exception;
    Optional<Day> getDay(long dayId);
}
