package org.gregb884.statistic.infrastructure.adapter.out.messaging;


import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.application.dto.ExerciseNameDto;
import org.gregb884.statistic.application.dto.ExerciseStatsDto;
import org.gregb884.statistic.application.dto.NotificationRequest;
import org.gregb884.statistic.application.port.out.NotificationPort;
import org.gregb884.statistic.domain.model.ExerciseStats;
import org.gregb884.statistic.infrastructure.adapter.out.api.ExerciseNameFetcherAdapter;
import org.gregb884.statistic.infrastructure.i18n.LocalizationService;
import org.gregb884.statistic.infrastructure.security.AuthenticatedUser;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RabbitMQNotificationClient implements NotificationPort {

    private final LocalizationService localizationService;
    private final RabbitTemplate rabbitTemplate;
    private final AuthenticatedUser authenticatedUser;
    private final ExerciseNameFetcherAdapter exerciseNameFetcherAdapter;


    public String getExerciseNameCorrectLang(ExerciseNameDto exerciseNameDto , String language){

        return switch (language.toLowerCase()) {
            case "pl" -> exerciseNameDto.getNamePl();
            case "de" -> exerciseNameDto.getNameDe();
            default -> exerciseNameDto.getName();
        };

    }


    public void newExercise(ExerciseNameDto exerciseName){

        String language = authenticatedUser.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.newExercise", language);


        NotificationRequest notificationRequest = new NotificationRequest(authenticatedUser.getEmail(), "NE" + localizedMessage + " " + getExerciseNameCorrectLang(exerciseName,language));
        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.statistic",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );

    }

    @Override
    public ExerciseNameDto newExerciseAchievement(long exerciseId) throws Exception {

        ExerciseNameDto exerciseNameDto = exerciseNameFetcherAdapter.getExerciseNameById(exerciseId);

        newExercise(exerciseNameDto);

        return exerciseNameDto;
    }



    @Override
    public ExerciseNameDto send1RmProgressNotification(ExerciseStatsDto exerciseStatsDto, double oldStat) throws Exception{

        ExerciseNameDto exerciseNameDto = exerciseNameFetcherAdapter.getExerciseNameById(exerciseStatsDto.getExerciseId());

        progress1Rm(exerciseNameDto,exerciseStatsDto.calculateOneRepMax(),oldStat);

        return exerciseNameDto;

    }

    private void progress1Rm(ExerciseNameDto body, double newStat, double oldStat) {

        String language = authenticatedUser.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.progress1Rm", language);

        NotificationRequest notificationRequest = new NotificationRequest(authenticatedUser.getEmail(), "PRO" + localizedMessage + " " + getExerciseNameCorrectLang(body,language) + " /n " + oldStat + "arrowGreen" + newStat + " Kg");

        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.statistic",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );
    }

    @Override
    public ExerciseNameDto sendProgressNotification(ExerciseStatsDto exerciseStatsDto) throws Exception {

        ExerciseNameDto exerciseNameDto = exerciseNameFetcherAdapter.getExerciseNameById(exerciseStatsDto.getExerciseId());

        progress(exerciseNameDto);

        return exerciseNameDto;
    }

    public void progress(ExerciseNameDto body) {


        String language = authenticatedUser.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.progress", language);

        NotificationRequest notificationRequest = new NotificationRequest(authenticatedUser.getEmail(), "PRO" + localizedMessage + " "  + getExerciseNameCorrectLang(body,language));

        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.statistic",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );

    }

    @Override
    public ExerciseNameDto sendRegressNotification(ExerciseStatsDto exerciseStatsDto) throws Exception {

        ExerciseNameDto exerciseNameDto = exerciseNameFetcherAdapter.getExerciseNameById(exerciseStatsDto.getExerciseId());

        regress(exerciseNameDto);

        return exerciseNameDto;
    }

    public void regress(ExerciseNameDto body) {

        String language = authenticatedUser.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.regress", language);

        NotificationRequest notificationRequest = new NotificationRequest(authenticatedUser.getEmail(), "RE" + localizedMessage + " " + getExerciseNameCorrectLang(body,language));
        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.statistic",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );
    }





}
