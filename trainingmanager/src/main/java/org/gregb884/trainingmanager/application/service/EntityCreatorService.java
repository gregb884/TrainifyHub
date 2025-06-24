package org.gregb884.trainingmanager.application.service;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.WeekDto;
import org.gregb884.trainingmanager.application.port.in.EntityCreatorUseCase;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;
import org.gregb884.trainingmanager.domain.model.TrainingPlan;
import org.gregb884.trainingmanager.domain.model.Week;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;

@Service
@AllArgsConstructor
public class EntityCreatorService implements EntityCreatorUseCase {


    private final DuplicateEntityService duplicateEntityService;


    @Override
    public void createNext3WeekForAiPlan(TrainingPlan trainingPlan) throws Exception {


        Set<Week> weeks = trainingPlan.getWeeks();
        if (weeks == null || weeks.isEmpty()) {
            throw new NoSuchElementException("Training plan has no weeks.");
        }

            Date startDate = trainingPlan.getWeeks().stream().findFirst().map(Week::getStartDate)
                    .orElseThrow(() -> new NoSuchElementException("No weeks found in training plan"));

            Long weekId = trainingPlan.getWeeks().stream().findFirst().map(Week::getId)
                    .orElseThrow(() -> new NoSuchElementException("No week found in training plan"));

            List<WeekDto> weekDtos = weekDtosForAdd3Weeks(startDate);

            int addWeeksCount = 0;

            for (WeekDto weekDto : weekDtos) {

                boolean successDuplicateWeek = duplicateEntityService.duplicateWeek(weekId,weekDto , true);

                if (successDuplicateWeek) {
                    addWeeksCount++;
                }
            }

    }


    public List<WeekDto> weekDtosForAdd3Weeks(Date startDate){

        LocalDate localStartDate = startDate.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
        List<WeekDto> weekDtos = new ArrayList<>();

        int weekNummber = 1;

        for (int i = 0 ; i < 3 ; i++) {

            WeekDto weekDto = new WeekDto();

            LocalDate localStartDateAfterAddDays = localStartDate.plusDays(7 * weekNummber);

            LocalDate localEndDate = localStartDateAfterAddDays.plusDays(6);

            weekDto.setStartDate(Date.from(localStartDateAfterAddDays.atStartOfDay(ZoneOffset.UTC).toInstant()));
            weekDto.setEndDate(Date.from(localEndDate.atStartOfDay(ZoneOffset.UTC).toInstant()));

            weekDtos.add(weekDto);

            weekNummber++;
        }

        return weekDtos;

    }


}
