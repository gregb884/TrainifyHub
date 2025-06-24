package org.gregb884.aiassist.infrastructure.adapter.out.messaging;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.dto.NotificationRequest;
import org.gregb884.aiassist.application.port.out.LocalizationPort;
import org.gregb884.aiassist.application.port.out.NotificationPort;
import org.gregb884.aiassist.infrastructure.security.AuthenticatedUser;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitMQNotificationClient implements NotificationPort {


    private final RabbitTemplate rabbitTemplate;
    private final LocalizationPort localizationPort;
    private final AuthenticatedUser authenticatedUser;


    @Override
    public void newAiPlanCreated(){

        String language = authenticatedUser.getLang();
        String localizedMessage = localizationPort.getLocalizedMessage("notification.newAiPlan", language);


        NotificationRequest notificationRequest = new NotificationRequest(authenticatedUser.getEmail(),  localizedMessage);

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
    public void createPlanFail() {

        String language = authenticatedUser.getLang();
        String localizedMessage = localizationPort.getLocalizedMessage("notification.createPlanFail", language);

        NotificationRequest notificationRequest = new NotificationRequest(authenticatedUser.getEmail(),  localizedMessage);
        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.newPlan",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "NotificationRequest");
                    return messagePostProcessor;
                }
        );
    }



}
