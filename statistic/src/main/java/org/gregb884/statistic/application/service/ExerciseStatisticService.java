package org.gregb884.statistic.application.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.application.dto.ExerciseNameDto;
import org.gregb884.statistic.application.dto.ExerciseStatsDto;
import org.gregb884.statistic.application.port.in.ExerciseStatisticUseCase;
import org.gregb884.statistic.application.port.in.UserHighlightsUseCase;
import org.gregb884.statistic.application.port.in.UserUseCase;
import org.gregb884.statistic.application.port.out.ExerciseNameFetcherPort;
import org.gregb884.statistic.application.port.out.NotificationPort;
import org.gregb884.statistic.domain.dto.ExerciseStatsDtoDetails;
import org.gregb884.statistic.domain.model.ExerciseStats;
import org.gregb884.statistic.domain.model.ProgressType;
import org.gregb884.statistic.domain.repository.ExerciseStatsRepositoryPort;
import org.gregb884.statistic.domain.service.ExerciseStatsService;
import org.gregb884.statistic.domain.shared.DateUtils;
import org.gregb884.statistic.infrastructure.security.AuthenticatedUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExerciseStatisticService implements ExerciseStatisticUseCase {

    private final ExerciseStatsRepositoryPort exerciseStatsRepository;
    private final AuthenticatedUser authenticatedUser;
    private final ExerciseStatsService exerciseStatsService = new ExerciseStatsService();
    private final ExerciseNameFetcherPort exerciseNameFetcherPort;
    private final NotificationPort notificationPort;
    private final UserHighlightsUseCase userHighlightsUseCase;
    private final UserUseCase userUseCase;


    @Override
    public List<ExerciseStatsDtoDetails> getExerciseDetails(long exerciseId) throws Exception {

        Optional<List<ExerciseStats>> exerciseStatsList = exerciseStatsRepository.findByExerciseIdAndUserId(exerciseId, authenticatedUser.getUserId());

        if (exerciseStatsList.isEmpty()) { throw new Exception("No exercise stats found for exercise " + exerciseId);}

        return exerciseStatsService.getAggregatesStatsList(exerciseStatsList.get());

    }


    @Override
    public Page<ExerciseNameDto> getExerciseNames(Pageable pageable) throws Exception {

        Page<Long> listId = exerciseStatsRepository.findDistinctExerciseIdsByUserId(authenticatedUser.getUserId(), pageable);

        List<ExerciseNameDto> exerciseNameDtoList = exerciseNameFetcherPort.getExerciseNameList(listId);

        return new PageImpl<>(exerciseNameDtoList, pageable, listId.getTotalElements());

    }



    private void progress1RmCheck(ExerciseStatsDto exerciseStatsDto) throws Exception {

        Optional<Double> max1RM = exerciseStatsRepository.findHighestOneRepMaxByExerciseIdAndUserId(exerciseStatsDto.getExerciseId(), authenticatedUser.getUserId());

        if(max1RM.isPresent()) {

            double newRm = exerciseStatsDto.calculateOneRepMax();

            if(newRm > max1RM.get()) {

                userHighlightsUseCase.setUser1Rm(
                        notificationPort.send1RmProgressNotification(exerciseStatsDto,max1RM.get()));

            }
        }
    }

    public Date checkWhenPreviousTraining(long exerciseId) {

        Pageable pageable = PageRequest.of(0, 1);

        LocalDate localDate = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDateTime startOfDayLdt = localDate.atStartOfDay();
        Date startOfDay = Date.from(startOfDayLdt.atZone(ZoneId.systemDefault()).toInstant());
        List<Date> lastTrainingDates = exerciseStatsRepository.findLastRecordedDateBefore(exerciseId, authenticatedUser.getUserId(), startOfDay, pageable);

        return  lastTrainingDates.isEmpty() ? null : lastTrainingDates.get(0);
    }



    public void progressOrRegressCheck(ExerciseStatsDto exerciseStatsDto) throws Exception {

        Date date = checkWhenPreviousTraining(exerciseStatsDto.getExerciseId());

        if (date == null) return;

        Date startOfDay = DateUtils.startOfDay(date);
        Date endOfDay = DateUtils.endOfDay(date);

            List<ExerciseStats> prevStats =
                    exerciseStatsRepository.findRecordsFromDate(exerciseStatsDto.getExerciseId(),
                            authenticatedUser.getUserId(),startOfDay,endOfDay).orElse(List.of());


            if (prevStats.isEmpty()) return;

            Optional<ExerciseStats> exerciseStats = prevStats.stream().findFirst();

                if (prevStats.size() > 1) {

                    Date dateActual = new Date();

                    Date startOfDayActual = DateUtils.startOfDay(dateActual);
                    Date endOfDayActual = DateUtils.endOfDay(dateActual);

                    List<ExerciseStats> todayStats =
                            exerciseStatsRepository.findRecordsFromDate(exerciseStatsDto.getExerciseId(),
                                    authenticatedUser.getUserId(),startOfDayActual,endOfDayActual).orElse(List.of());

                    ProgressType progressType = exerciseStatsService.detectProgressOrRegress(todayStats,prevStats);

                    switch (progressType) {
                        case REGRESS -> userHighlightsUseCase.setUserRegress(notificationPort.sendRegressNotification(exerciseStatsDto));
                        case PROGRESS -> userHighlightsUseCase.setUserProgress(notificationPort.sendProgressNotification(exerciseStatsDto));
                    }



                } else {
                    double newRm = exerciseStatsDto.calculateOneRepMax();
                    double oldRm = exerciseStats.get().getOneRepMax();

                    if (newRm > oldRm) {
                        userHighlightsUseCase.setUser1Rm(notificationPort.send1RmProgressNotification(exerciseStatsDto, oldRm));
                    } else if (newRm < oldRm) {
                        userHighlightsUseCase.setUserRegress(notificationPort.sendRegressNotification(exerciseStatsDto));
                    }
                }

    }


    @Override
    public Double calculate1Rm(int exerciseId) {


        Optional<Double> highestOneRep = getHighestOneRepMax(exerciseId,authenticatedUser.getUserId());

        return highestOneRep.orElse(null);

    }

    public Optional<Double> getHighestOneRepMax(long exerciseId, long userId) {
        return exerciseStatsRepository.findHighestOneRepMaxByExerciseIdAndUserId(exerciseId, userId);
    }


    public boolean newExercise(long exerciseId) {

        return exerciseStatsRepository.existsByExerciseIdAndUserId(exerciseId, authenticatedUser.getUserId());

    }


    @Override
    @Transactional
    public void save(ExerciseStatsDto exerciseStatsDto) throws Exception{

        long exerciseId = exerciseStatsDto.getExerciseId();

        try {

            ExerciseStats exerciseStats = new ExerciseStats();
            exerciseStats.setExerciseId(exerciseStatsDto.getExerciseId());
            exerciseStats.setReps(exerciseStatsDto.getReps());
            exerciseStats.setWeight(exerciseStatsDto.getWeight());
            exerciseStats.setUser(userUseCase.getUser(authenticatedUser.getUserId()));
            exerciseStats.setAddDate(new Date());

            if(!newExercise(exerciseId))
            {
                userHighlightsUseCase.setUserNewExercise(notificationPort.newExerciseAchievement(exerciseId));
                exerciseStatsRepository.save(exerciseStats);
                return;
            }

            progress1RmCheck(exerciseStatsDto);

            exerciseStatsRepository.save(exerciseStats);

            progressOrRegressCheck(exerciseStatsDto);

        } catch (Exception e) {

            throw new Exception(e);
        }

    }



}
