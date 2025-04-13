package org.gregb884.notification.service;
import org.gregb884.notification.firebase.FirebaseService;
import org.gregb884.notification.model.Notification;
import org.gregb884.notification.model.User;
import org.gregb884.notification.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.gregb884.notification.model.NotificationRequest;

import java.util.List;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final NotificationRepository notificationRepository;
    private final FirebaseService firebaseService;

    public NotificationService(SimpMessagingTemplate messagingTemplate, UserService userService, NotificationRepository notificationRepository, FirebaseService firebaseService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
        this.notificationRepository = notificationRepository;
        this.firebaseService = firebaseService;
    }

    @RabbitListener(queues = "notificationsQueue", autoStartup = "true")
    public void consumeNotification(@Payload NotificationRequest notificationRequest) {
        User user = userService.getUserByEmail(notificationRequest.getEmail());
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


    public List<Notification> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdAndReadFalse(userId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}