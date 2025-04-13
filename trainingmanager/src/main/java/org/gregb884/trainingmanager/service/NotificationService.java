package org.gregb884.trainingmanager.service;

import org.gregb884.trainingmanager.model.User;
import org.gregb884.trainingmanager.rabbitMq.NotificationRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

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



    public void newPlanCreated(String email){

       String language = userService.getLang();
       String localizedMessage = localizationService.getLocalizedMessage("notification.newPlan", language);



       NotificationRequest notificationRequest = new NotificationRequest(email, userService.getUserName() + " " + localizedMessage);

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


    public void traineeDoneWeek(long creatorId,int weekNumber) {

        String language = userService.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.trainee", language) + " " +
                userService.getUserEmail() + " " +
                localizationService.getLocalizedMessage("notification.traineeDoneWeek", language) + " " + weekNumber;

        User trainer = userService.findById(creatorId);

        NotificationRequest notificationRequest = new NotificationRequest(trainer.getUsername(), localizedMessage);

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

    public void traineeDoneTrainingPlan(long creatorId, String name) {

        String language = userService.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.trainee", language) + " " +
                userService.getUserEmail() + " " +
                localizationService.getLocalizedMessage("notification.traineeDoneTrainingPlan", language) + " " + name;

        User trainer = userService.findById(creatorId);

        NotificationRequest notificationRequest = new NotificationRequest(trainer.getUsername(), localizedMessage);

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
