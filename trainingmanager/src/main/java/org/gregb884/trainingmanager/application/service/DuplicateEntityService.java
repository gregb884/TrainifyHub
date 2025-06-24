package org.gregb884.trainingmanager.application.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.dynamic.DynamicType;
import org.gregb884.trainingmanager.application.dto.DayDto;
import org.gregb884.trainingmanager.application.dto.ExercisePlanDto;
import org.gregb884.trainingmanager.application.dto.WeekDto;
import org.gregb884.trainingmanager.application.mapper.ExercisePlanMapper;
import org.gregb884.trainingmanager.application.port.in.*;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.model.Week;
import org.gregb884.trainingmanager.domain.repository.ExercisePlanRepositoryPort;
import org.gregb884.trainingmanager.domain.repository.WeekRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DuplicateEntityService {

    private final WeekRepositoryPort weekRepository;
    private final DayCreateUseCase dayUseCase;
    private final AuthenticatedUser authenticatedUser;
    private final ExercisePlanMapper exercisePlanMapper;
    private final ExercisePlanRepositoryPort exercisePlanRepository;
    private final ExerciseSeriesUseCase exerciseSeriesUseCase;



    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public boolean duplicateWeek(long weekId, WeekDto weekDto , boolean aiPlan) throws Exception {

        long creatorId;
        if (aiPlan){
            creatorId = 2L;
        } else {
            creatorId = authenticatedUser.getUserId();
        }

        Optional<Week> week = weekRepository.findByIdAndOnlyCreatorId(weekId, creatorId);

        if (week.isPresent()) {

            Week newWeek = new Week();

            newWeek.setDone(false);
            newWeek.setCreatorId(week.get().getCreatorId());
            newWeek.setStartDate(weekDto.getStartDate());
            newWeek.setEndDate(weekDto.getEndDate());
            newWeek.setTrainingPlan(week.get().getTrainingPlan());
            weekRepository.save(newWeek);
            createNewDayForDuplicate(newWeek.getId(),weekId);

            entityManager.flush();
            entityManager.refresh(newWeek);

            duplicateExercisePlan(newWeek.getDays(), week.get().getDays());

            return true;
        }


        return false;

    }

    public void createNewDayForDuplicate(long newWeekId, Long oldWeekId ) throws Exception {

        Optional<Week> oldWeek = weekRepository.findByIdAndUserId(oldWeekId, authenticatedUser.getUserId());
        Optional<Week> newWeek = weekRepository.findByIdAndUserId(newWeekId, authenticatedUser.getUserId());

        if (oldWeek.isEmpty() || newWeek.isEmpty()) throw new Exception("No Week found");

        Set<Day> oldDays = oldWeek.get().getDays();

        Calendar startCalendar = Calendar.getInstance();
        startCalendar.setTime(newWeek.get().getStartDate());

        for (Day day : oldDays) {

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(day.getPlannedDate());
            int dayNumber =  calendar.get(Calendar.DAY_OF_WEEK);

            calendar.setTime(newWeek.get().getStartDate());

            int daysToAdd = (dayNumber - Calendar.MONDAY);
            calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);

            Date dayPlannedDate = calendar.getTime();

            DayDto dayDto = new DayDto();
            dayDto.setPlannedDate(dayPlannedDate);
            dayDto.setName(day.getName());

            dayUseCase.create(newWeekId,dayDto);
        }

    }

    public void duplicateExercisePlan(Set<Day> newWeekDays, Set<Day> oldWeekDays) throws Exception {

        for (Day day : oldWeekDays) {

            Day newDay = newWeekDays.stream().filter(day1 -> day1.getName().equals(day.getName())).findFirst().get();

            Set<ExercisePlan> exercisePlanFromOldDay = day.getExercisePlans();

            for (ExercisePlan exercisePlan : exercisePlanFromOldDay) {
                ExercisePlanDto exercisePlanDto = exercisePlanMapper.toDto(exercisePlan);
                creatorForDuplicateEntity(newDay,exercisePlanDto,exercisePlan.getExercise());
            }
        }
    }

    public void creatorForDuplicateEntity(Day day , ExercisePlanDto exercisePlanDto, Exercise exercise){

        ExercisePlan exercisePlan = exercisePlanMapper.toDomain(exercisePlanDto);
        exercisePlan.setDay(day);
        exercisePlan.setExercise(exercise);
        exercisePlanRepository.save(exercisePlan);
        exercisePlan.setExerciseSeries(exerciseSeriesUseCase.createSeriesForPlan(exercisePlan));
    }




}
