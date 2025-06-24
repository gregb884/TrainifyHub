package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.WeekDto;
import org.gregb884.trainingmanager.domain.model.Week;

import java.util.Optional;

public interface WeekUseCase {


    void setDone(long id) throws Exception;
    Optional<Week> get(long id);
    long createNew(long planId, WeekDto weekDto);
    Optional<Week> getWithAccessControl(long id) throws Exception;
    boolean deleteWeek(long id);
    boolean edit(long id, Week week);
    boolean cloneWeek(long weekId, WeekDto weekDto) throws Exception;


}
