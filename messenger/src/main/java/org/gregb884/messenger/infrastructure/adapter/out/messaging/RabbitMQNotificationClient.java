package org.gregb884.messenger.infrastructure.adapter.out.messaging;

import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.application.dto.NotificationRequestDto;
import org.gregb884.messenger.application.port.out.LocalizationPort;
import org.gregb884.messenger.application.port.out.NotificationPort;
import org.gregb884.messenger.application.port.out.UserLanguageFetcherPort;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitMQNotificationClient implements NotificationPort {

    private final RabbitTemplate rabbitTemplate;
    private final UserLanguageFetcherPort userLanguageFetcherPort;
    private final LocalizationPort localizationPort;


    @Override
    public void sendNotification(String email, String message) {

        NotificationRequestDto notificationRequest = new NotificationRequestDto(email, message);

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

    @Override
    public void sendNewMessageNotification(String recipient, String sender, String message) {

        String language = userLanguageFetcherPort.getLang(recipient);

        String messageToSend = localizationPort.getLocalizedMessage("notification.newConversation",language) + " " + sender + " {}" + message ;

        sendNotification(recipient,messageToSend);
    }


}
