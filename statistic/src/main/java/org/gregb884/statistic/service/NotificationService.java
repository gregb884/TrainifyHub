package org.gregb884.statistic.service;
import org.gregb884.statistic.dto.ExerciseNameDto;
import org.gregb884.statistic.dto.ExerciseStatsDto;
import org.gregb884.statistic.model.ExerciseStats;
import org.gregb884.statistic.rabbitMq.NotificationRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService {


    private final UserService userService;
    private final RabbitTemplate rabbitTemplate;
    private final LocalizationService localizationService;

    public NotificationService(UserService userService, RabbitTemplate rabbitTemplate, LocalizationService localizationService) {
        this.userService = userService;
        this.rabbitTemplate = rabbitTemplate;
        this.localizationService = localizationService;
    }

    public String getExerciseNameCorrectLang(ExerciseNameDto exerciseNameDto , String language){

        return switch (language.toLowerCase()) {
            case "pl" -> exerciseNameDto.getNamePl();
            case "de" -> exerciseNameDto.getNameDe();
            default -> exerciseNameDto.getName();
        };

    }



    public void newExercise(ExerciseNameDto exerciseName){

       String language = userService.getLang();
       String localizedMessage = localizationService.getLocalizedMessage("notification.newExercise", language);


       NotificationRequest notificationRequest = new NotificationRequest(userService.getUserEmail(), "NE" + localizedMessage + " " + getExerciseNameCorrectLang(exerciseName,language));
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


    public void regress(ExerciseNameDto body, ExerciseStatsDto exerciseStatsDto, Optional<ExerciseStats> minOneRepMaxStat) {


        String language = userService.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.regress", language);

        NotificationRequest notificationRequest = new NotificationRequest(userService.getUserEmail(), "RE" + localizedMessage + " " + getExerciseNameCorrectLang(body,language));
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

    public void progress(ExerciseNameDto body, ExerciseStatsDto exerciseStatsDto, Optional<ExerciseStats> minOneRepMaxStat) {


        String language = userService.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.progress", language);

        NotificationRequest notificationRequest = new NotificationRequest(userService.getUserEmail(), "PRO" + localizedMessage + " "  + getExerciseNameCorrectLang(body,language));

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

    public void progress1Rm(ExerciseNameDto body, double newStat, double oldStat) {

        String language = userService.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.progress1Rm", language);

        NotificationRequest notificationRequest = new NotificationRequest(userService.getUserEmail(), "PRO" + localizedMessage + " " + getExerciseNameCorrectLang(body,language) + " /n " + oldStat + "arrowGreen" + newStat + " Kg");

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
