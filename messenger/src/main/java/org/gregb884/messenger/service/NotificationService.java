package org.gregb884.messenger.service;
import org.gregb884.messenger.rabbitMq.NotificationRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationService {

    private final RabbitTemplate rabbitTemplate;

    public NotificationService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }


    public void sendNotification(String email, String message) {

        NotificationRequest notificationRequest = new NotificationRequest(email, message);

        rabbitTemplate.convertAndSend(
                "notificationsExchange",
                "notifications.newMessage",
                notificationRequest,
                messagePostProcessor -> {
                    messagePostProcessor.getMessageProperties().setHeader("__TypeId__", "org.gregb884.notification.model.NotificationRequest");
                    return messagePostProcessor;
                }
        );

    }


}
