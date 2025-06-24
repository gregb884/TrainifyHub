package org.gregb884.trainingmanager.infrastructure.adapter.out.messaging;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.dto.NotificationRequest;
import org.gregb884.trainingmanager.application.port.out.NotificationPort;
import org.gregb884.trainingmanager.domain.model.User;
import org.gregb884.trainingmanager.infrastructure.i18n.LocalizationService;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitMQNotificationClient implements NotificationPort {


    private final AuthenticatedUser authenticatedUser;
    private final LocalizationService localizationService;
    private final RabbitTemplate rabbitTemplate;


    @Override
    public void newPlanCreated(String email){

        String language = authenticatedUser.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.newPlan", language);



        NotificationRequest notificationRequest = new NotificationRequest(email, authenticatedUser.getEmail() + " " + localizedMessage);

        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.newPlan",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );

    }


    @Override
    public void traineeDoneWeek(int weekNumber, String trainer) {

        String language = authenticatedUser.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.trainee", language) + " " +
                authenticatedUser.getEmail() + " " +
                localizationService.getLocalizedMessage("notification.traineeDoneWeek", language) + " " + weekNumber;


        NotificationRequest notificationRequest = new NotificationRequest(trainer, localizedMessage);

        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.newPlan",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );


    }

    @Override
    public void traineeDoneTrainingPlan(String name, String trainer) {

        String language = authenticatedUser.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.trainee", language) + " " +
                authenticatedUser.getEmail() + " " +
                localizationService.getLocalizedMessage("notification.traineeDoneTrainingPlan", language) + " " + name;


        NotificationRequest notificationRequest = new NotificationRequest(trainer, localizedMessage);

        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.newPlan",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );




    }





}
