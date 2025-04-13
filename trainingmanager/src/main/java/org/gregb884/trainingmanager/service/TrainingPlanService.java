package org.gregb884.trainingmanager.service;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.dto.*;
import org.gregb884.trainingmanager.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.mapper.TrainingPlanMapper;
import org.gregb884.trainingmanager.model.*;
import org.gregb884.trainingmanager.repository.ExerciseRepository;
import org.gregb884.trainingmanager.repository.TrainingPlanRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrainingPlanService {

    private final TrainingPlanRepository trainingPlanRepository;
    private final UserService userService;
    private final TrainingPlanMapper trainingPlanMapper;
    private final RestTemplate restTemplate;
    private final ExerciseRepository exerciseRepository;
    private final WeekService weekService;

    private static final String aiPlanDownload_URL = "http://AIASSIST/api/aiPlan/get" ;
    private static final String checkAccessToPlans_URL = "http://AUTH/api/users/readyPlansAccessCheck" ;



    public TrainingPlanService(TrainingPlanRepository trainingPlanRepository, UserService userService, TrainingPlanMapper trainingPlanMapper, RestTemplate restTemplate, ExerciseRepository exerciseRepository,@Lazy WeekService weekService) {
        this.trainingPlanRepository = trainingPlanRepository;
        this.userService = userService;
        this.trainingPlanMapper = trainingPlanMapper;
        this.restTemplate = restTemplate;

        this.exerciseRepository = exerciseRepository;
        this.weekService = weekService;
    }


    @Transactional
    public long newPlanForYourself(TrainingPlanDto trainingPlanDto) {

        TrainingPlan trainingPlan = new TrainingPlan();
        trainingPlan.setCreatorId(userService.getUserId());
        trainingPlan.setName(trainingPlanDto.getName());
        Set<User> users = new HashSet<>();
        users.add(userService.findById(userService.getUserId()));
        trainingPlan.setUsers(users);
        trainingPlan.setTemplate(trainingPlanDto.getTemplate());
        trainingPlanRepository.save(trainingPlan);

        return trainingPlan.getId();

    }

    @Transactional
    public TrainingPlan getViewSingle(long id) throws Exception {

        long userId = userService.getUserId();

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(id,userId,userId);

        if (trainingPlan.isPresent()) {

            if (trainingPlan.get().getCreatorId() == 1L) {


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

        }

       return trainingPlan.orElse(null);

    }

    @Transactional
    public TrainingPlan getViewSingleForAi(long id) {

        long userId = userService.getUserId();

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(id,userId,userId);


        return trainingPlan.orElse(null);

    }

    @Transactional
    public TrainingPlan getViewSingleOnlyCreatorId(long id) {

        long userId = userService.getUserId();

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorId(id,userId);

        return trainingPlan.orElse(null);

    }

    public List<TrainingPlan> getAllPlans() {

        long userId = userService.getUserId();

        Optional<List<TrainingPlan>> trainingPlanList = trainingPlanRepository.findByCreatorIdOrUserId(userId,userId);

        return trainingPlanList.orElse(null);

    }

    public long newPlanForUser(String email,TrainingPlanDto trainingPlanDto) {




        TrainingPlan trainingPlan = new TrainingPlan();
        trainingPlan.setCreatorId(userService.getUserId());
        trainingPlan.setName(trainingPlanDto.getName());
        trainingPlan.setUsers(userService.findByUserName(email));
        trainingPlan.setTemplate(false);

        trainingPlanRepository.save(trainingPlan);

        return trainingPlan.getId();
    }

    public ResponseEntity<String> sumPlans() {

       long count = trainingPlanRepository.countByCreatorIdOrUserId(userService.getUserId());

        return ResponseEntity.ok(String.valueOf(count));
    }

    public ResponseEntity<String> myPlans() {

        long count = trainingPlanRepository.countTrainingPlanByUserIdWithoutSchema(userService.getUserId());

        return ResponseEntity.ok(String.valueOf(count));
    }

    public boolean delete(long id) {

        long userid = userService.getUserId();

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(id,userid,userid);

        if(trainingPlan.isPresent()) {

            trainingPlanRepository.deleteById(id);

            return true;
        }



        return false;
    }

    @Transactional
    public Long assignPlan(long planId, String userEmail, AssignPlanDto assignPlanDto) throws Exception {

        Date startDateFromDtoDate = assignPlanDto.getStartDate();
        LocalDate startDateFromDtoLocal = startDateFromDtoDate.toInstant().atZone(ZoneOffset.UTC).toLocalDate();

        if (!startDateFromDtoLocal.getDayOfWeek().equals(DayOfWeek.MONDAY)){
            throw new Exception("Only from MONDAY dates are supported");
        }


        Optional<TrainingPlan> trainingPlanOptional = trainingPlanRepository.findByIdAndCreatorId(planId, userService.getUserId());

        if (trainingPlanOptional.isPresent()) {
            TrainingPlan originalPlan = trainingPlanOptional.get();

            if (!(originalPlan.getWeeks().stream().findFirst().get().getDays().size() == assignPlanDto.getWeekDay().size()))
            {
                throw new Exception("Select correct quantity days ");
            }

            // Clone the plan training
            TrainingPlan clonedPlan = trainingPlanMapper.clonePlan(originalPlan);

            clonedPlan.setUsers(userService.findByUserName(userEmail));

            // Save the cloned plan first, without relationships
            TrainingPlan savedClonedPlan = trainingPlanRepository.save(clonedPlan);

            // Convert startDate from Date to LocalDate
            Date startDateOld = assignPlanDto.getStartDate();
            LocalDate startDate = startDateOld.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
            startDate = startDate.minusDays(7);

            // Clone weeks and their related entities
            Set<Week> clonedWeeks = new HashSet<>();
            for (Week originalWeek : originalPlan.getWeeks()) {
                Week clonedWeek = trainingPlanMapper.cloneWeek(originalWeek);
                clonedWeek.setTrainingPlan(savedClonedPlan); // Set the newly saved plan

                // Set start and end dates for the week
                startDate = startDate.plusDays(7);
                clonedWeek.setStartDate(Date.from(startDate.atStartOfDay(ZoneOffset.UTC).toInstant()));

                LocalDate endDate = startDate.plusDays(6);
                clonedWeek.setEndDate(Date.from(endDate.atStartOfDay(ZoneOffset.UTC).toInstant()));

                // Clone days
                Set<Day> clonedDays = new HashSet<>();
                List<Integer> dayList = new ArrayList<>(assignPlanDto.getWeekDay());
                int dayIndex = 0;

                for (Day originalDay : originalWeek.getDays()) {
                    Day clonedDay = trainingPlanMapper.cloneDay(originalDay);
                    clonedDay.setWeek(clonedWeek); // Set the cloned week

                    // Set planned date for the day
                    LocalDate dayDate = startDate.plusDays(dayList.get(dayIndex));
                    clonedDay.setPlannedDate(Date.from(dayDate.atStartOfDay(ZoneOffset.UTC).toInstant()));
                    dayIndex++;

                    // Clone exercise plans
                    Set<ExercisePlan> clonedExercisePlans = new HashSet<>();
                    for (ExercisePlan originalExercisePlan : originalDay.getExercisePlans()) {
                        ExercisePlan clonedExercisePlan = trainingPlanMapper.cloneExercisePlan(originalExercisePlan);
                        clonedExercisePlan.setDay(clonedDay); // Set the cloned day

                        // Clone exercise series
                        Set<ExerciseSeries> clonedExerciseSeriesSet = new HashSet<>();
                        for (ExerciseSeries originalSeries : originalExercisePlan.getExerciseSeries()) {
                            ExerciseSeries clonedSeries = trainingPlanMapper.cloneExerciseSeries(originalSeries);
                            clonedSeries.setExercisePlan(clonedExercisePlan); // Set the cloned exercise plan

                            clonedExerciseSeriesSet.add(clonedSeries);
                        }

                        // Assign the cloned exercise series to the cloned exercise plan
                        clonedExercisePlan.setExerciseSeries(clonedExerciseSeriesSet);

                        // Add the cloned exercise plan to the set
                        clonedExercisePlans.add(clonedExercisePlan);
                    }

                    // Assign the cloned exercise plans to the cloned day
                    clonedDay.setExercisePlans(clonedExercisePlans);

                    // Add the cloned day to the set
                    clonedDays.add(clonedDay);
                }

                // Assign the cloned days to the cloned week
                clonedWeek.setDays(clonedDays);

                // Add the cloned week to the set
                clonedWeeks.add(clonedWeek);
            }

            // Assign the cloned weeks to the cloned training plan
            savedClonedPlan.setWeeks(clonedWeeks);

            savedClonedPlan.setTemplate(false);

            // Save the entire structure again with relationships now
            trainingPlanRepository.save(savedClonedPlan);

            return savedClonedPlan.getId();
        }

        return null;
    }

    @Transactional
    public Long assignPlanFromWorkoutPlans(long planId, AssignPlanDto assignPlanDto) throws Exception {

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


        Date startDateFromDtoDate = assignPlanDto.getStartDate();
        LocalDate startDateFromDtoLocal = startDateFromDtoDate.toInstant().atZone(ZoneOffset.UTC).toLocalDate();

        if (!startDateFromDtoLocal.getDayOfWeek().equals(DayOfWeek.MONDAY)){
            throw new Exception("Only from MONDAY dates are supported");
        }


        Optional<TrainingPlan> trainingPlanOptional = trainingPlanRepository.findByIdAndCreatorId(planId, 1L);

        if (trainingPlanOptional.isPresent()) {
            TrainingPlan originalPlan = trainingPlanOptional.get();

            if (!(originalPlan.getWeeks().stream().findFirst().get().getDays().size() == assignPlanDto.getWeekDay().size()))
            {
                throw new Exception("Select correct quantity days ");
            }

            // Clone the plan training
            TrainingPlan clonedPlan = trainingPlanMapper.clonePlan(originalPlan);

            clonedPlan.setUsers(userService.findByUserName(userService.getUserEmail()));

            // Save the cloned plan first, without relationships
            TrainingPlan savedClonedPlan = trainingPlanRepository.save(clonedPlan);

            // Convert startDate from Date to LocalDate
            Date startDateOld = assignPlanDto.getStartDate();
            LocalDate startDate = startDateOld.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
            startDate = startDate.minusDays(7);

            // Clone weeks and their related entities
            Set<Week> clonedWeeks = new HashSet<>();
            for (Week originalWeek : originalPlan.getWeeks()) {
                Week clonedWeek = trainingPlanMapper.cloneWeek(originalWeek);
                clonedWeek.setTrainingPlan(savedClonedPlan); // Set the newly saved plan

                startDate = startDate.plusDays(7);
                clonedWeek.setStartDate(Date.from(startDate.atStartOfDay(ZoneOffset.UTC).toInstant()));

                LocalDate endDate = startDate.plusDays(6);
                clonedWeek.setEndDate(Date.from(endDate.atStartOfDay(ZoneOffset.UTC).toInstant()));

                // Clone days
                Set<Day> clonedDays = new HashSet<>();
                List<Integer> dayList = new ArrayList<>(assignPlanDto.getWeekDay());
                int dayIndex = 0;

                for (Day originalDay : originalWeek.getDays()) {
                    Day clonedDay = trainingPlanMapper.cloneDay(originalDay);
                    clonedDay.setWeek(clonedWeek); // Set the cloned week

                    // Set planned date for the day
                    LocalDate dayDate = startDate.plusDays(dayList.get(dayIndex));
                    clonedDay.setPlannedDate(Date.from(dayDate.atStartOfDay(ZoneOffset.UTC).toInstant()));
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE", Locale.ENGLISH);
                    clonedDay.setName(dayDate.format(formatter).toLowerCase());
                    dayIndex++;

                    // Clone exercise plans
                    Set<ExercisePlan> clonedExercisePlans = new HashSet<>();
                    for (ExercisePlan originalExercisePlan : originalDay.getExercisePlans()) {
                        ExercisePlan clonedExercisePlan = trainingPlanMapper.cloneExercisePlan(originalExercisePlan);
                        clonedExercisePlan.setDay(clonedDay); // Set the cloned day

                        // Clone exercise series
                        Set<ExerciseSeries> clonedExerciseSeriesSet = new HashSet<>();
                        for (ExerciseSeries originalSeries : originalExercisePlan.getExerciseSeries()) {
                            ExerciseSeries clonedSeries = trainingPlanMapper.cloneExerciseSeries(originalSeries);
                            clonedSeries.setExercisePlan(clonedExercisePlan); // Set the cloned exercise plan

                            clonedExerciseSeriesSet.add(clonedSeries);
                        }

                        // Assign the cloned exercise series to the cloned exercise plan
                        clonedExercisePlan.setExerciseSeries(clonedExerciseSeriesSet);

                        // Add the cloned exercise plan to the set
                        clonedExercisePlans.add(clonedExercisePlan);
                    }

                    // Assign the cloned exercise plans to the cloned day
                    clonedDay.setExercisePlans(clonedExercisePlans);

                    // Add the cloned day to the set
                    clonedDays.add(clonedDay);
                }

                // Assign the cloned days to the cloned week
                clonedWeek.setDays(clonedDays);

                // Add the cloned week to the set
                clonedWeeks.add(clonedWeek);
            }

            // Assign the cloned weeks to the cloned training plan
            savedClonedPlan.setWeeks(clonedWeeks);

            savedClonedPlan.setTemplate(false);

            // Save the entire structure again with relationships now
            trainingPlanRepository.save(savedClonedPlan);

            return savedClonedPlan.getId();
        }

        return null;
    }

    public ResponseEntity<List<TrainingPlanViewTemplateDto>> myTemplateView() {


        Optional<List<TrainingPlan>> trainingPlans = trainingPlanRepository.findTemplatesByCreatorId(userService.getUserId());

        if (trainingPlans.isPresent()) {
            List<TrainingPlanViewTemplateDto> dtoList = trainingPlans.get().stream()
                    .map(plan -> {
                        TrainingPlanViewTemplateDto dto = new TrainingPlanViewTemplateDto();
                        dto.setName(plan.getName());
                        dto.setTrainingDays(plan.getWeeks().stream().findFirst().get().getDays().size());
                        dto.setId(plan.getId());
                        return dto;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtoList);
        }

        return null;
    }

    public ResponseEntity<Long> userInTrainingPlan(long id) {


        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(id,userService.getUserId(),userService.getUserId());


        return trainingPlan.map(plan -> ResponseEntity.ok(plan.getUsers().stream().findFirst().get().getId())).orElseGet(() -> ResponseEntity.notFound().build());

    }

    private TrainingPlanSimpleViewDto convertToSimpleDto(TrainingPlan trainingPlan) {

        TrainingPlanSimpleViewDto dto = new TrainingPlanSimpleViewDto();
        dto.setId(trainingPlan.getId());
        dto.setName(trainingPlan.getName());

        return dto;
    }

    public List<TrainingPlanSimpleViewDto> getAllPlansSimpleDto() {

        long userId = userService.getUserId();

        Optional<List<TrainingPlan>> trainingPlanList = trainingPlanRepository.findByCreatorIdOrUserId(userId,userId);

        return trainingPlanList.orElse(Collections.emptyList())
                .stream()
                .map(this::convertToSimpleDto)
                .collect(Collectors.toList());

    }


    public TrainingPlanSummaryDto toSummaryDto(TrainingPlan trainingPlan) {


        TrainingPlanSummaryDto dto = new TrainingPlanSummaryDto();
        dto.setPlanName(trainingPlan.getName());
        dto.setWeekCount(trainingPlan.getWeeks() != null ? trainingPlan.getWeeks().size() : 0);

        List<TrainingPlanSummaryDto.ExerciseSummary> exerciseSummaries = new ArrayList<>();
        if (trainingPlan.getWeeks() != null) {
            trainingPlan.getWeeks().forEach(week -> {
                if (week.getDays() != null) {
                    week.getDays().forEach(day -> {
                        if (day.getExercisePlans() != null) {
                            day.getExercisePlans().forEach(exercisePlan -> {
                                TrainingPlanSummaryDto.ExerciseSummary exerciseSummary = new TrainingPlanSummaryDto.ExerciseSummary();
                                exerciseSummary.setExerciseName(exercisePlan.getExercise().getName());

                                OptionalDouble totalRepetitions = exercisePlan.getExerciseSeries().stream()
                                        .mapToInt(series -> series.getTotalRepetitions())
                                        .average();
                                OptionalDouble totalWeight = exercisePlan.getExerciseSeries().stream()
                                        .mapToDouble(series -> series.getTotalWeight())
                                        .average();

                                exerciseSummary.setTotalRepetitions(totalRepetitions.getAsDouble());
                                exerciseSummary.setTotalWeight(totalWeight.getAsDouble());

                                exerciseSummaries.add(exerciseSummary);
                            });
                        }
                    });
                }
            });
        }

        dto.setExercises(exerciseSummaries);
        return dto;
    }


    public Date calculateEndDate(Date startDate) {

        LocalDate localStartDate = startDate.toInstant().atZone(ZoneOffset.UTC).toLocalDate();

        LocalDate localEndDate = localStartDate.plusDays(6);

        return Date.from(localEndDate.atStartOfDay(ZoneOffset.UTC).toInstant());
    }

    public Date calculateDayDate(Date startDate, int day) {

        LocalDate localStartDate = startDate.toInstant().atZone(ZoneOffset.UTC).toLocalDate();

        LocalDate localPlannedDate = localStartDate.plusDays(day);

        return Date.from(localPlannedDate.atStartOfDay(ZoneOffset.UTC).toInstant());
    }

    public String dayNameFromDate(Date date) {

        LocalDateTime localDateTime = date.toInstant()
                .atZone(ZoneOffset.UTC)
                .toLocalDateTime();


        return  localDateTime.getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

    }

    public Set<ExerciseSeries> createSeriesForPlan(ExercisePlan exercisePlan) {

        Set<ExerciseSeries> exerciseSeriesSet = new HashSet<ExerciseSeries>();

        for (int i = 0;i < exercisePlan.getPlannedSeries();i++){

            ExerciseSeries exerciseSeries = new ExerciseSeries();
            exerciseSeries.setExercisePlan(exercisePlan);
            exerciseSeriesSet.add(exerciseSeries);
        }

        return exerciseSeriesSet;
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


    @Transactional
    public Long createAiPlan(Long aiTrainingPlanId, Date startDate , String days) {


       try {

           ResponseEntity<AiTrainingPlan> response = restTemplate.exchange(
                   aiPlanDownload_URL + "?id=" + aiTrainingPlanId,
                   HttpMethod.GET,
                   null,
                   AiTrainingPlan.class
           );


           AiTrainingPlan aiTrainingPlan = response.getBody();

           List<Integer> integerDayList = Arrays.stream(days.split(","))
                   .map(Integer::parseInt)
                   .toList();


           Long userId = userService.getUserId();

           TrainingPlan newTrainingPlan = new TrainingPlan();

           newTrainingPlan.setTemplate(false);
           newTrainingPlan.setCreatorId(2);
           assert aiTrainingPlan != null;
           newTrainingPlan.setName(aiTrainingPlan.getPlanName());
           Set<User> users = new HashSet<>();
           users.add(userService.findById(userId));
           newTrainingPlan.setUsers(users);

           Week newWeek = new Week();
           newWeek.setDone(false);
           newWeek.setStartDate(startDate);
           newWeek.setEndDate(calculateEndDate(startDate));
           newWeek.setTrainingPlan(newTrainingPlan);
           newWeek.setCreatorId(newTrainingPlan.getCreatorId());

           Set<Day> daySet = new HashSet<>();

           int day = 0;

           for (AiTrainingPlan.Day aiDay : aiTrainingPlan.getAiDays()){

               Day newDay = new Day();

               newDay.setCreatorId(2);
               newDay.setPlannedDate(calculateDayDate(startDate, integerDayList.get(day)));
               newDay.setName(dayNameFromDate(newDay.getPlannedDate()));

               Set<ExercisePlan> exercisePlanSet = new HashSet<>();

               int order = 1;


               for (AiTrainingPlan.Exercise aiExercise : aiDay.getAiExercises()){

                   ExercisePlan newExercisePlan = new ExercisePlan();

                   List<AiTrainingPlan.OptionalExercise> exerciseList = aiExercise.getOptionalExerciseList();

                   Optional<AiTrainingPlan.OptionalExercise> selectedExercise = exerciseList.stream().filter(AiTrainingPlan.OptionalExercise::isSelected).findFirst();

                   newExercisePlan.setPlannedRepetitions(aiExercise.getRepetitions());
                   newExercisePlan.setPlannedSeries(aiExercise.getPlannedSeries());
                   newExercisePlan.setExerciseOrder(order);
                   newExercisePlan.setExercise(exerciseRepository.findByIdAndIsPrivateFalseOrCreatorId(selectedExercise.get().getExerciseId(),userId).get());
                   newExercisePlan.setDay(newDay);
                   newExercisePlan.setExerciseSeries(createSeriesForPlan(newExercisePlan));

                   exercisePlanSet.add(newExercisePlan);

                   order++;
               }




               newDay.setExercisePlans(exercisePlanSet);
               newDay.setWeek(newWeek);
               daySet.add(newDay);

               day++;

           }

           newWeek.setDays(daySet);

           Set<Week> weekSet = new HashSet<>();

           weekSet.add(newWeek);


           newTrainingPlan.setWeeks(weekSet);


           trainingPlanRepository.save(newTrainingPlan);

           return newTrainingPlan.getId();


       } catch (Exception e) {

           return null;

       }

    }


    public void createNext3WeekForAiPlan(Long aiTrainingPlanId) {

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(aiTrainingPlanId, userService.getUserId(), userService.getUserId());

        if (trainingPlan.isPresent()) {

            Date startDate = trainingPlan.get().getWeeks().stream().findFirst().get().getStartDate();

            Long weekId = trainingPlan.get().getWeeks().stream().findFirst().get().getId();

            List<WeekDto> weekDtos = weekDtosForAdd3Weeks(startDate);

            int addWeeksCount = 0;

            for (WeekDto weekDto : weekDtos) {

                boolean successDuplicateWeek = weekService.duplicateWeekForAiPlan(weekId,weekDto);

                if (successDuplicateWeek) {
                    addWeeksCount++;
                }
            }

        }
    }

    public ResponseEntity<String> sumSchema() {

        if (!userService.getUserRole().equals("ROLE_TRAINER")){

            return ResponseEntity.badRequest().body("Only for Trainer");

        }

        Long sumSchema = trainingPlanRepository.countSchemaByTrainerId(userService.getUserId());

        return ResponseEntity.ok(sumSchema.toString());

    }

    public void setToCheck(long id) {

        TrainingPlan trainingPlan = trainingPlanRepository.findById(id).get();

        trainingPlan.setChecked(false);
        trainingPlanRepository.save(trainingPlan);

    }

    public ResponseEntity<String> sumPlanToCheck() {

       Long count =  trainingPlanRepository.countPlanToCheck(userService.getUserId());

       return ResponseEntity.ok(count.toString());

    }

    public ResponseEntity<String> setPlanToChecked(long id) {


        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorId(id, userService.getUserId());

        if (trainingPlan.isPresent()) {

            trainingPlan.get().setChecked(true);

            trainingPlanRepository.save(trainingPlan.get());

            return ResponseEntity.ok("Success");

        }

        return ResponseEntity.notFound().build();


    }

    public ResponseEntity<TrainingPlanDtoWithDate> getNearestDay() {

        try {

            Optional<List<TrainingPlan>> trainingPlanListOptional = trainingPlanRepository.findFirstByClosestUnfinishedTrainingPlanForUser(userService.getUserId());

            if (trainingPlanListOptional.isEmpty() || trainingPlanListOptional.get().isEmpty()) {
                throw new NoSuchElementException("No training plans found for the user.");
            }

            TrainingPlan closestTrainingPlan = trainingPlanListOptional.get().stream()
                    .findFirst()
                    .orElseThrow(() -> new NoSuchElementException("No training plans found for the user."));

            Date today = truncateTime(new Date());


            Date date = closestTrainingPlan.getWeeks().stream()
                    .flatMap(week -> week.getDays().stream())
                    .filter(day -> day.getDoneDate() == null)
                    .filter(day -> !truncateTime(day.getPlannedDate()).before(today))
                    .map(Day::getPlannedDate)
                    .min(Date::compareTo)
                    .orElseThrow(() -> new NoSuchElementException("No unfinished training days found."));

            TrainingPlanDtoWithDate planDtoWithDate = new TrainingPlanDtoWithDate(closestTrainingPlan.getName(), date);

            return ResponseEntity.ok(planDtoWithDate);

        } catch (NoSuchElementException e){

            return ResponseEntity.notFound().build();

        }

    }


    private Date truncateTime(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    }

