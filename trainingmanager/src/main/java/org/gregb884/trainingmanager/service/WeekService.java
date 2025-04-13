package org.gregb884.trainingmanager.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.dto.DayDto;
import org.gregb884.trainingmanager.dto.WeekDto;
import org.gregb884.trainingmanager.model.Day;
import org.gregb884.trainingmanager.model.TrainingPlan;
import org.gregb884.trainingmanager.model.Week;
import org.gregb884.trainingmanager.repository.WeekRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.WeekFields;
import java.util.*;

import static com.fasterxml.jackson.databind.type.LogicalType.DateTime;

@Service
public class WeekService {

    private final TrainingPlanService trainingPlanService;
    private final WeekRepository repository;
    private final UserService userService;
    private final DayService dayService;
    private final ExercisePlanService exercisePlanService;
    private final NotificationService notificationService;
    private final RestTemplate restTemplate;


    private static final String checkAccessToPlans_URL = "http://AUTH/api/users/readyPlansAccessCheck" ;

    @PersistenceContext
    private EntityManager entityManager;

    public WeekService(TrainingPlanService trainingPlanService, WeekRepository repository, UserService userService, @Lazy DayService dayService, @Lazy ExercisePlanService exercisePlanService, NotificationService notificationService, RestTemplate restTemplate) {
        this.trainingPlanService = trainingPlanService;
        this.repository = repository;
        this.userService = userService;
        this.dayService = dayService;
        this.exercisePlanService = exercisePlanService;
        this.notificationService = notificationService;
        this.restTemplate = restTemplate;
    }


    @Transactional
    public long createNew(long planId, WeekDto weekDto) {

        Week newWeek = new Week();
        newWeek.setDone(false);
        newWeek.setStartDate(weekDto.getStartDate());
        newWeek.setEndDate(weekDto.getEndDate());
        newWeek.setTrainingPlan(trainingPlanService.getViewSingleOnlyCreatorId(planId));
        newWeek.setCreatorId(newWeek.getTrainingPlan().getCreatorId());
        repository.save(newWeek);
        return newWeek.getId();
    }


    public Optional<Week> getWithAccessControl(long id) throws Exception {

       Optional<Week> optionalWeek = repository.findByIdAndUserId(id, userService.getUserId());

       if (optionalWeek.isPresent() && optionalWeek.get().getCreatorId() == 1) {

           try {

               ResponseEntity<String> response = restTemplate.exchange(
                       checkAccessToPlans_URL,
                       HttpMethod.GET,
                       null,
                       String.class
               );

               if (!response.getStatusCode().is2xxSuccessful() || response.getBody().equals("Access denied")) {

                   throw new Exception("No access to assign plan");
               }

           } catch (Exception e){

               throw new Exception("No access to assign plan");

           }


       }

       return optionalWeek;

    }

    public Optional<Week> get(long id) {

        return repository.findByIdAndUserId(id, userService.getUserId());


    }

    public boolean deleteWeek(long id) {

       Optional<Week> week = repository.findByIdAndUserId(id, userService.getUserId());

       if (week.isPresent()) {

           repository.delete(week.get());
           return true;
       }

       return false;

    }

    public boolean edit(long id, Week week) {

        Optional<Week> weekToEdit = repository.findByIdAndOnlyCreatorId(id, userService.getUserId());

        if (weekToEdit.isPresent()) {

            weekToEdit.get().setStartDate(week.getStartDate());
            weekToEdit.get().setEndDate(week.getEndDate());
            repository.save(weekToEdit.get());

            return true;
        }

        return false;


    }

    @Transactional
    public boolean duplicateWeek(long weekId, WeekDto weekDto) {

        Optional<Week> week = repository.findByIdAndOnlyCreatorId(weekId, userService.getUserId());

        if (week.isPresent()) {

            Week newWeek = new Week();

            newWeek.setDone(false);
            newWeek.setCreatorId(week.get().getCreatorId());
            newWeek.setStartDate(weekDto.getStartDate());
            newWeek.setEndDate(weekDto.getEndDate());
            newWeek.setTrainingPlan(week.get().getTrainingPlan());
            repository.save(newWeek);
            dayService.createNewDayForDuplicate(newWeek.getId(),weekId);

            entityManager.flush();
            entityManager.refresh(newWeek);

            exercisePlanService.duplicateExercisePlan(newWeek.getDays(), week.get().getDays());

            return true;
        }


        return false;

    }

    @Transactional
    public boolean duplicateWeekForAiPlan(long weekId, WeekDto weekDto) {

        Optional<Week> week = repository.findByIdAndOnlyCreatorId(weekId, 2L);

        if (week.isPresent()) {

            Week newWeek = new Week();

            newWeek.setDone(false);
            newWeek.setCreatorId(week.get().getCreatorId());
            newWeek.setStartDate(weekDto.getStartDate());
            newWeek.setEndDate(weekDto.getEndDate());
            newWeek.setTrainingPlan(week.get().getTrainingPlan());
            repository.save(newWeek);
            dayService.createNewDayForDuplicate(newWeek.getId(),weekId);

            entityManager.flush();
            entityManager.refresh(newWeek);

            exercisePlanService.duplicateExercisePlan(newWeek.getDays(), week.get().getDays());

            return true;
        }


        return false;

    }

    public void setDone(long id) throws Exception {


        Optional<Week> week = repository.findByIdAndUserId(id, userService.getUserId());

        if (week.isPresent()) {

            int countWeek = week.get().getDays().size();

            int doneDay = 0;

            for (Day day : week.get().getDays()) {

                if (day.getDoneDate() != null){

                    doneDay++;

                }
            }

            if (doneDay == countWeek) {

                week.get().setDone(true);

                repository.save(week.get());

                if (week.get().getCreatorId() != 1L && week.get().getCreatorId() != 2L & week.get().getCreatorId() != userService.getUserId()) {

                    Date date = week.get().getStartDate();
                    LocalDate localDate = date.toInstant().atZone(ZoneOffset.UTC).toLocalDate();

                    int weekNumber = localDate.get(WeekFields.of(Locale.getDefault()).weekOfYear());

                    notificationService.traineeDoneWeek(week.get().getCreatorId(),weekNumber);

                    TrainingPlan trainingPlan = trainingPlanService.getViewSingle(week.get().getTrainingPlan().getId());

                    int weekCount = trainingPlan.getWeeks().size();
                    int doneWeek = 0;

                    for (Week week1 : trainingPlan.getWeeks()) {

                        if (week1.getDone()){
                            doneWeek++;
                        }
                    }

                    if (weekCount == doneWeek) {


                        trainingPlanService.setToCheck(week.get().getTrainingPlan().getId());
                        notificationService.traineeDoneTrainingPlan(week.get().getCreatorId(),trainingPlan.getName());

                    }

                }



            }


        }



    }
}
