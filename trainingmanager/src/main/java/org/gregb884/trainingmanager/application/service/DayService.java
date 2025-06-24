package org.gregb884.trainingmanager.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.dto.DayDto;
import org.gregb884.trainingmanager.application.mapper.DayMapper;
import org.gregb884.trainingmanager.application.port.in.DayUseCase;
import org.gregb884.trainingmanager.application.port.in.WeekUseCase;
import org.gregb884.trainingmanager.application.port.out.AccessToPaidPlansCheckPort;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Week;
import org.gregb884.trainingmanager.domain.repository.DayRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DayService implements DayUseCase {

    private final DayRepositoryPort dayRepository;
    private final AuthenticatedUser authenticatedUser;
    private final DayMapper dayMapper;
    private final AccessToPaidPlansCheckPort accessToPaidPlansCheckPort;
    private final WeekUseCase weekUseCase;


    @Override
    public Optional<Day> getDay(long id) {

        return dayRepository.findByIdAndUserIdOrCreatorId(id,authenticatedUser.getUserId());
    }




    @Override
    public boolean edit(long dayId, DayDto dayDto) {

        Optional<Day> dayToEdit = dayRepository.findByIdAndOnlyCreatorId(dayId, authenticatedUser.getUserId());

        if (dayToEdit.isPresent()) {
            dayToEdit.get().setName(dayDto.getName());
            dayToEdit.get().setPlannedDate(dayDto.getPlannedDate());
            dayRepository.save(dayToEdit.get());
            return true;
        }
        return false;
    }

    @Override
    public boolean delete(long id) {

        Optional<Day> dayToDelete = dayRepository.findByIdAndOnlyCreatorId(id, authenticatedUser.getUserId());

        if (dayToDelete.isPresent()) {
            dayRepository.delete(dayToDelete.get());
            return true;
        }

        return false;

    }




    @Override
    public boolean setDone(long id) throws Exception {


        Optional<Day> dayToEdit = dayRepository.findByIdAndUserIdOrCreatorId(id, authenticatedUser.getUserId());


        if (dayToEdit.isPresent()) {

            LocalDate localDate = LocalDate.now();
            ZonedDateTime zonedDateTime = localDate.atStartOfDay(ZoneOffset.UTC);
            Date date = Date.from(zonedDateTime.toInstant());

            dayToEdit.get().setDoneDate(date);

            dayRepository.save(dayToEdit.get());

            weekUseCase.setDone(dayToEdit.get().getWeek().getId());

            return true;
        }

       return false;

    }

    public Optional<Day> getDayWithAccessControl(long id) throws Exception {

        Optional<Day> day =  dayRepository.findByIdAndUserIdOrCreatorId(id,authenticatedUser.getUserId());

        if (day.isPresent() && day.get().getCreatorId() == 1L) {

           boolean access =  accessToPaidPlansCheckPort.accessToPaidPlan();

           if (access) {
               return day;
           }

        }

        return day;

    }




}
