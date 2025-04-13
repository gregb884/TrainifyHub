package org.gregb884.profilemanager.service;

import org.gregb884.profilemanager.model.Request;
import org.gregb884.profilemanager.rabbitMq.NotificationRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationService {

    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;

    public NotificationService(RestTemplate restTemplate, RabbitTemplate rabbitTemplate) {
        this.restTemplate = restTemplate;
        this.rabbitTemplate = rabbitTemplate;
    }


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
