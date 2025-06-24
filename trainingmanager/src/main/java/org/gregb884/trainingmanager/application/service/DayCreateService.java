package org.gregb884.trainingmanager.application.service;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.DayDto;
import org.gregb884.trainingmanager.application.mapper.DayMapper;
import org.gregb884.trainingmanager.application.port.in.DayCreateUseCase;
import org.gregb884.trainingmanager.application.port.in.WeekUseCase;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Week;
import org.gregb884.trainingmanager.domain.repository.DayRepositoryPort;
import org.gregb884.trainingmanager.domain.repository.WeekRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class DayCreateService implements DayCreateUseCase {

    private final DayRepositoryPort dayRepository;
    private final WeekRepositoryPort weekRepository;
    private final AuthenticatedUser authenticatedUser;
    private final DayMapper dayMapper;

    @Override
    public boolean create(long weekId, DayDto dayDto) {


        Optional<Week> week = weekRepository.findByIdAndUserId(weekId, authenticatedUser.getUserId());

        if (week.isPresent()) {
            dayRepository.save(
                    dayMapper.toDomainWithWeekAndCreatorId(dayDto,week.get(),week.get().getCreatorId()));
            return true;
        }

        return false;
    }


    @Override
    public Optional<Day> getDay(long id) {

        return dayRepository.findByIdAndUserIdOrCreatorId(id,authenticatedUser.getUserId());
    }

}
