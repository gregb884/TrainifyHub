package org.gregb884.profilemanager.infrastructure.adapter.out.messaging;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.dto.NotificationRequest;
import org.gregb884.profilemanager.application.port.out.NotificationPort;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class RabbitMQNotificationClient implements NotificationPort {


    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;

    public void sendNotification(String email, String message) {
        NotificationRequest notificationRequest = new NotificationRequest(email, message);

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
