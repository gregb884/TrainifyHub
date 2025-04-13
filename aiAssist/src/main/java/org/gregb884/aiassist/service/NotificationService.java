package org.gregb884.aiassist.service;

import org.gregb884.aiassist.rabbitMq.NotificationRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {


    private final UserService userService;
    private final LocalizationService localizationService;
    private final RabbitTemplate rabbitTemplate;


    public NotificationService(UserService userService, LocalizationService localizationService, RabbitTemplate rabbitTemplate) {
        this.userService = userService;
        this.localizationService = localizationService;
        this.rabbitTemplate = rabbitTemplate;
    }


    public void newAiPlanCreated(){

        String language = userService.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.newAiPlan", language);


        NotificationRequest notificationRequest = new NotificationRequest(userService.getEmail(),  localizedMessage);

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


    public void createPlanFail() {

        String language = userService.getLang();
        String localizedMessage = localizationService.getLocalizedMessage("notification.createPlanFail", language);


        NotificationRequest notificationRequest = new NotificationRequest(userService.getEmail(),  localizedMessage);
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
