package org.gregb884.trainingmanager.service;

import org.gregb884.trainingmanager.dto.DayDto;
import org.gregb884.trainingmanager.model.Day;
import org.gregb884.trainingmanager.model.Week;
import org.gregb884.trainingmanager.repository.DayRepository;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

@Service
public class DayService {

   private final DayRepository repository;
   private final WeekService weekService;
   private final UserService userService;
   private final TrainingPlanService trainingPlanService;
   private final RestTemplate restTemplate;
    private static final String checkAccessToPlans_URL = "http://AUTH/api/users/readyPlansAccessCheck" ;

    public DayService(DayRepository repository, WeekService weekService, UserService userService, TrainingPlanService trainingPlanService, RestTemplate restTemplate) {
        this.repository = repository;
        this.weekService = weekService;
        this.userService = userService;
        this.trainingPlanService = trainingPlanService;
        this.restTemplate = restTemplate;
    }



    public Optional<Day> getDay(long id) {

        return repository.findByIdAndUserIdOrCreatorId(id,userService.getUserId());
    }

    public boolean create(long weekId, DayDto dayDto) {

        Day newDay = new Day();
        Optional<Week> week = weekService.get(weekId);

        if (week.isPresent()) {

            newDay.setWeek(week.get());
            newDay.setName(dayDto.getName());
            newDay.setPlannedDate(dayDto.getPlannedDate());
            newDay.setCreatorId(week.get().getCreatorId());
            repository.save(newDay);
            return true;
        }

        return false;
    }

    public boolean edit(long dayId, DayDto dayDto) {

        Optional<Day> dayToEdit = repository.findByIdAndOnlyCreatorId(dayId, userService.getUserId());

        if (dayToEdit.isPresent()) {
            dayToEdit.get().setName(dayDto.getName());
            dayToEdit.get().setPlannedDate(dayDto.getPlannedDate());
            repository.save(dayToEdit.get());
            return true;
        }

        return false;

    }

    public boolean delete(long id) {

        Optional<Day> dayToDelete = repository.findByIdAndOnlyCreatorId(id, userService.getUserId());

        if (dayToDelete.isPresent()) {
            repository.delete(dayToDelete.get());
            return true;
        }

        return false;

    }

    public void createNewDayForDuplicate(long newWeekId, Long oldWeekId ) {

        Optional<Week> oldWeek = weekService.get(oldWeekId);
        Optional<Week> newWeek = weekService.get(newWeekId);

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

            create(newWeekId,dayDto);
        }

    }

    public ResponseEntity<String> setDone(long id) throws Exception {


        Optional<Day> dayToEdit = repository.findByIdAndUserIdOrCreatorId(id, userService.getUserId());


        if (dayToEdit.isPresent()) {

            LocalDate localDate = LocalDate.now();
            ZonedDateTime zonedDateTime = localDate.atStartOfDay(ZoneOffset.UTC);
            Date date = Date.from(zonedDateTime.toInstant());

            dayToEdit.get().setDoneDate(date);

            repository.save(dayToEdit.get());

            weekService.setDone(dayToEdit.get().getWeek().getId());

            return ResponseEntity.ok("done");
        }

        return ResponseEntity.badRequest().body("Error edit Day");

    }

    public Optional<Day> getDayWithAccessControl(long id) throws Exception {

        Optional<Day> day =  repository.findByIdAndUserIdOrCreatorId(id,userService.getUserId());

        if (day.isPresent() && day.get().getCreatorId() == 1L) {

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

        return day;

    }
}
