package org.gregb884.notification.infrastructure.adapter.out;

import lombok.RequiredArgsConstructor;
import org.gregb884.notification.application.dto.NotificationRequest;
import org.gregb884.notification.application.port.in.UserUseCase;
import org.gregb884.notification.domain.model.Notification;
import org.gregb884.notification.domain.model.User;
import org.gregb884.notification.domain.repository.NotificationRepositoryPort;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitListenerNotification {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserUseCase userUseCase;
    private final NotificationRepositoryPort notificationRepository;
    private final FirebaseService firebaseService;


    @RabbitListener(queues = "notificationsQueue", autoStartup = "true")
    public void consumeNotification(@Payload NotificationRequest notificationRequest) {
        User user = userUseCase.getUserByEmail(notificationRequest.getEmail());
        if (user != null) {

            Notification notification = new Notification(user.getId(),notificationRequest.getMessage());

            if (!notification.getMessage().startsWith("You have a new message from")
                    && !notification.getMessage().startsWith("Masz nową wiadomość od")
                    && !notification.getMessage().startsWith("Du hast eine neue Nachricht von")) {

                notificationRepository.save(notification);

                notificationRequest.setId(notification.getId());

                String destination = "/topic/notifications/" + user.getId();
                messagingTemplate.convertAndSend(destination, notificationRequest);

            }

            try {
                if (user.getFcmToken() != null && !user.getFcmToken().isEmpty()) {

                    if (notification.getMessage().startsWith("You have a new message from")
                            || notification.getMessage().startsWith("Masz nową wiadomość od")
                            ||
                            notification.getMessage().startsWith("Du hast eine neue Nachricht von")) {

                        String[] messageParts = notification.getMessage().split("\\{}", 2);

                        String title = messageParts.length > 0 ? messageParts[0].trim() : "TrainifyHub";
                        String body = messageParts.length > 1 ? messageParts[1].trim() : notification.getMessage();

                        firebaseService.sendPushNotificationMessenger(user.getFcmToken(),title,body);
                    } else {

                        firebaseService.sendPushNotification(user.getFcmToken(), "TrainifyHub", notificationRequest.getMessage());
                    }


                }
            }catch (Exception e) {

                System.out.println(e.getMessage());
            }


        }
    }


}
