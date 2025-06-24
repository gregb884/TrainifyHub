package org.gregb884.auth.infrastructure.adapter.out.messaging;

import org.gregb884.auth.application.port.out.NotificationServicePort;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.gregb884.auth.application.dto.NotificationRequestDto;

@Component
public class RabbitMQNotificationClient implements NotificationServicePort {


    private final RabbitTemplate rabbitTemplate;

    public RabbitMQNotificationClient(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }


    public void sendNotification(String email, String message) {
        NotificationRequestDto notificationRequest = new NotificationRequestDto(email, message);

        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.subscriptionEnd",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );
    }


}