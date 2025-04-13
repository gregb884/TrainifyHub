package org.gregb884.statistic.service;

import jakarta.transaction.Transactional;
import org.gregb884.statistic.dto.ExerciseStatsDto;
import org.gregb884.statistic.dto.ExerciseNameDto;
import org.gregb884.statistic.dto.ExerciseStatsDtoDetails;
import org.gregb884.statistic.mapper.ExerciseStatsMapper;
import org.gregb884.statistic.model.ExerciseStats;
import org.gregb884.statistic.model.User;
import org.gregb884.statistic.repository.ExerciseStatsRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExerciseStatsService {

    private final ExerciseStatsRepository exerciseStatsRepository;
    private final UserService userService;
    private final RestTemplate restTemplate;
    private final NotificationService notificationService;

    public ExerciseStatsService(ExerciseStatsRepository exerciseStatsRepository, UserService userService, RestTemplate restTemplate, NotificationService notificationService) {
        this.exerciseStatsRepository = exerciseStatsRepository;
        this.userService = userService;
        this.restTemplate = restTemplate;
        this.notificationService = notificationService;
    }

    private String trainingModuleGetExerciseName = "http://TRAININGMANAGER/api/exercise/getName?id=";
    private String trainingModuleGetExerciseNameList = "http://TRAININGMANAGER/api/exercise/getNameList";


    @Transactional
    public ResponseEntity<String> save(ExerciseStatsDto exerciseStatsDto) {

        long exerciseId = exerciseStatsDto.getExerciseId();

        try {

            ExerciseStats exerciseStats = new ExerciseStats();
            exerciseStats.setExerciseId(exerciseStatsDto.getExerciseId());
            exerciseStats.setReps(exerciseStatsDto.getReps());
            exerciseStats.setWeight(exerciseStatsDto.getWeight());
            exerciseStats.setUser(userService.getUser(userService.getUserId()));
            exerciseStats.setAddDate(new Date());

            if(!newExercise(exerciseId))
            {
                newExerciseAchievement(exerciseId);
                exerciseStatsRepository.save(exerciseStats);
                return ResponseEntity.ok("Exercise stats saved");
            }

            progress1RmCheck(exerciseStatsDto);

            exerciseStatsRepository.save(exerciseStats);

            progressOrRegressCheck(exerciseStatsDto);

            return ResponseEntity.ok("Exercise stats saved");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    private void progress1RmCheck(ExerciseStatsDto exerciseStatsDto) throws Exception {

        Optional<Double> max1RM = exerciseStatsRepository.findHighestOneRepMaxByExerciseIdAndUserId(exerciseStatsDto.getExerciseId(), userService.getUserId());

        if(max1RM.isPresent()) {

            double newRm = exerciseStatsDto.calculateOneRepMax();

            if(newRm > max1RM.get()) {

                send1RmProgressNotification(exerciseStatsDto,max1RM.get());

            }

        }

    }


    public boolean newExercise(long exerciseId) {


        return exerciseStatsRepository.existsByExerciseIdAndUserId(exerciseId, userService.getUserId());

    }


    public void newExerciseAchievement(long exerciseId) throws Exception {

            try {

                ResponseEntity<ExerciseNameDto> exerciseResponse = restTemplate.getForEntity(trainingModuleGetExerciseName + exerciseId, ExerciseNameDto.class);

                if (exerciseResponse.getStatusCode().is2xxSuccessful()) {


                    notificationService.newExercise(exerciseResponse.getBody());

                    String userLang = userService.getLang();


                    switch(userLang) {
                        case "en": userService.setUserNewExercise(exerciseResponse.getBody().getName());
                        break;
                        case "pl": userService.setUserNewExercise(exerciseResponse.getBody().getNamePl());
                        break;
                        case "de": userService.setUserNewExercise(exerciseResponse.getBody().getNameDe());
                        break;
                    }

                }

            } catch (Exception e) {

                throw new Exception("Could not get exercise name", e);

            }

    }

    public Optional<Double> getHighestOneRepMax(long exerciseId, long userId) {
        return exerciseStatsRepository.findHighestOneRepMaxByExerciseIdAndUserId(exerciseId, userId);
    }

    public ResponseEntity<Optional<Double>> calculate1Rm(int exerciseId) {


        return ResponseEntity.ok(getHighestOneRepMax(exerciseId, userService.getUserId()));

    }


    public Date checkWhenPreviousTraining(long exerciseId) {

        Pageable pageable = PageRequest.of(0, 1);

        LocalDate localDate = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDateTime startOfDayLdt = localDate.atStartOfDay();
        Date startOfDay = Date.from(startOfDayLdt.atZone(ZoneId.systemDefault()).toInstant());
        List<Date> lastTrainingDates = exerciseStatsRepository.findLastRecordedDateBefore(exerciseId, userService.getUserId(), startOfDay, pageable);

       return  lastTrainingDates.isEmpty() ? null : lastTrainingDates.get(0);
    }



    public void progressOrRegressCheck(ExerciseStatsDto exerciseStatsDto) throws Exception {

        Date date = checkWhenPreviousTraining(exerciseStatsDto.getExerciseId());


        if (date == null) {

            return;

        } else {


            LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

            LocalDateTime startOfDayLdt = localDate.atStartOfDay();
            Date startOfDay = Date.from(startOfDayLdt.atZone(ZoneId.systemDefault()).toInstant());


            LocalDateTime endOfDayLdt = localDate.atTime(23, 59, 59);
            Date endOfDay = Date.from(endOfDayLdt.atZone(ZoneId.systemDefault()).toInstant());

            Optional<List<ExerciseStats>> exerciseStatsList =
                    exerciseStatsRepository.findRecordsFromDate(exerciseStatsDto.getExerciseId(),
                            userService.getUserId(),startOfDay,endOfDay);

            if (exerciseStatsList.isPresent()) {

                Optional<ExerciseStats> exerciseStats = exerciseStatsList.get().stream().findFirst();

                if (exerciseStatsList.get().size() > 1) {

                    Date dateActual = new Date();

                    LocalDate localDateActual = dateActual.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    LocalDateTime startOfDayLdtActual = localDateActual.atStartOfDay();
                    Date startOfDayActual = Date.from(startOfDayLdtActual.atZone(ZoneId.systemDefault()).toInstant());
                    LocalDateTime endOfDayLdtActual = localDateActual.atTime(23, 59, 59);
                    Date endOfDayActual = Date.from(endOfDayLdtActual.atZone(ZoneId.systemDefault()).toInstant());

                    Optional<List<ExerciseStats>> exerciseStatsListActual =
                            exerciseStatsRepository.findRecordsFromDate(exerciseStatsDto.getExerciseId(),
                                    userService.getUserId(),startOfDayActual,endOfDayActual);


                    if (exerciseStatsListActual.isPresent() && exerciseStatsListActual.get().size() == exerciseStatsList.get().size()) {

                        double averageMaxToday = exerciseStatsListActual.get().stream().mapToDouble(ExerciseStats::getOneRepMax).average().getAsDouble();
                        double averageMaxPrevious = exerciseStatsList.get().stream().mapToDouble(ExerciseStats::getOneRepMax).average().getAsDouble();
                        List<ExerciseStats> stats = exerciseStatsListActual.get();

                        if (averageMaxToday > averageMaxPrevious) {

                            Optional<ExerciseStats> maxOneRepMaxStat = stats.stream()
                                    .max(Comparator.comparingDouble(ExerciseStats::getOneRepMax));

                            sendProgressNotification(exerciseStatsDto,maxOneRepMaxStat);

                        } else if (averageMaxToday < averageMaxPrevious) {

                            Optional<ExerciseStats> minOneRepMaxStat = stats.stream()
                                    .min(Comparator.comparingDouble(ExerciseStats::getOneRepMax));

                            sendRegressNotification(exerciseStatsDto,minOneRepMaxStat);
                            
                        }

                    }

                } else if (exerciseStatsList.get().size() == 1) {


                    if (exerciseStatsDto.calculateOneRepMax() > exerciseStats.get().getOneRepMax()) {

                        sendProgressNotification(exerciseStatsDto, exerciseStats);

                    } else if (exerciseStatsDto.calculateOneRepMax() < exerciseStats.get().getOneRepMax()) {

                        sendRegressNotification(exerciseStatsDto, exerciseStats);

                    }

                }

            }

        }

    }

    private void sendRegressNotification(ExerciseStatsDto exerciseStatsDto, Optional<ExerciseStats> minOneRepMaxStat) throws Exception {

        try {

            ResponseEntity<ExerciseNameDto> exerciseResponse = restTemplate.getForEntity(trainingModuleGetExerciseName + exerciseStatsDto.getExerciseId(), ExerciseNameDto.class);

            if (exerciseResponse.getStatusCode().is2xxSuccessful()) {


                notificationService.regress(exerciseResponse.getBody(),exerciseStatsDto,minOneRepMaxStat);

                String userLang = userService.getLang();

                switch (userLang) {

                    case "en": userService.setUserRegress(exerciseResponse.getBody().getName());
                        break;
                    case "pl": userService.setUserRegress(exerciseResponse.getBody().getNamePl());
                        break;
                    case "de": userService.setUserRegress(exerciseResponse.getBody().getNameDe());
                }

            }

        } catch (Exception e) {

            throw new Exception("Could not get exercise name", e);

        }

    }

    private void sendProgressNotification(ExerciseStatsDto exerciseStatsDto, Optional<ExerciseStats> maxOneRepMaxStat) throws Exception {

        try {

            ResponseEntity<ExerciseNameDto> exerciseResponse = restTemplate.getForEntity(trainingModuleGetExerciseName + exerciseStatsDto.getExerciseId(), ExerciseNameDto.class);

            if (exerciseResponse.getStatusCode().is2xxSuccessful()) {
                
                notificationService.progress(exerciseResponse.getBody(),exerciseStatsDto,maxOneRepMaxStat);

                String userLang = userService.getLang();

                switch (userLang) {

                    case "en": userService.setUserProgress(exerciseResponse.getBody().getName());
                        break;
                    case "pl": userService.setUserProgress(exerciseResponse.getBody().getNamePl());
                        break;
                    case "de": userService.setUserProgress(exerciseResponse.getBody().getNameDe());
                }

            }

        } catch (Exception e) {

            throw new Exception("Could not get exercise name", e);

        }

    }

    private void send1RmProgressNotification(ExerciseStatsDto exerciseStatsDto, double oldStat) throws Exception {


        try {

            ResponseEntity<ExerciseNameDto> exerciseResponse = restTemplate.getForEntity(trainingModuleGetExerciseName + exerciseStatsDto.getExerciseId(), ExerciseNameDto.class);

            if (exerciseResponse.getStatusCode().is2xxSuccessful()) {

                notificationService.progress1Rm(exerciseResponse.getBody(),exerciseStatsDto.calculateOneRepMax(),oldStat);
                String userLang = userService.getLang();

                switch (userLang) {

                    case "en": userService.setUser1Rm(exerciseResponse.getBody().getName());
                    break;
                    case "pl": userService.setUser1Rm(exerciseResponse.getBody().getNamePl());
                    break;
                    case "de": userService.setUser1Rm(exerciseResponse.getBody().getNameDe());
                }

            }

        } catch (Exception e) {

            throw new Exception("Could not get exercise name", e);

        }

    }

    public ResponseEntity <Page<ExerciseNameDto>> getAllExercisesName(int page, int size) throws Exception {

        Pageable pageable = PageRequest.of(page, size);

       Page<Long> listId = exerciseStatsRepository.findDistinctExerciseIdsByUserId(userService.getUserId(),pageable);


           try {

               ResponseEntity<List<ExerciseNameDto>> exerciseNameList = restTemplate.exchange(
                       trainingModuleGetExerciseNameList,
                       HttpMethod.POST,
                       new HttpEntity<>(listId.getContent()),
                       new ParameterizedTypeReference<List<ExerciseNameDto>>() {}
               );

               if (exerciseNameList.getStatusCode().is2xxSuccessful()) {


                   Page<ExerciseNameDto> exercisesPage = new PageImpl<>(Objects.requireNonNull(exerciseNameList.getBody()), pageable, listId.getTotalElements());

                   return ResponseEntity.ok(exercisesPage);

               }

           } catch (Exception e) {

               throw new Exception("Could not get exercise name List", e);

           }

          return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }

    public ResponseEntity<List<ExerciseStatsDtoDetails>> getExerciseDetails(long exerciseId) throws Exception {

        Optional<List<ExerciseStats>> exerciseStatsList = exerciseStatsRepository.findByExerciseIdAndUserId(exerciseId, userService.getUserId());

        if (exerciseStatsList.isPresent()) {
            List<ExerciseStats> stats = exerciseStatsList.get();
            int totalRecords = stats.size();

            if (totalRecords <= 100) {
                List<ExerciseStatsDtoDetails> dtoList = stats.stream()
                        .map(ExerciseStatsMapper::toDetailsDto)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(dtoList);
            }

            int targetSize = 100;
            int groupSize = (int) Math.ceil((double) totalRecords / targetSize);

            List<ExerciseStatsDtoDetails> aggregatedList = new ArrayList<>();

            for (int i = 0; i < targetSize; i++) {
                int startIdx = i * groupSize;
                int endIdx = Math.min(startIdx + groupSize, totalRecords);

                List<ExerciseStats> group = stats.subList(startIdx, endIdx);

                int avgReps = (int) group.stream().mapToInt(ExerciseStats::getReps).average().orElse(0);
                double avgWeight = group.stream().mapToDouble(ExerciseStats::getWeight).average().orElse(0);
                double avgOneRepMax = group.stream().mapToDouble(ExerciseStats::getOneRepMax).average().orElse(0);
                Date date = group.get(group.size() - 1).getAddDate();

                ExerciseStatsDtoDetails aggregatedDto = new ExerciseStatsDtoDetails(avgReps, avgWeight, avgOneRepMax, date);

                aggregatedList.add(aggregatedDto);

                if (endIdx >= totalRecords) {
                    break;
                }
            }

            return ResponseEntity.ok(aggregatedList);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
