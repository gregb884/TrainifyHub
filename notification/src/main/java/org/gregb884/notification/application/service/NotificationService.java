package org.gregb884.notification.application.service;


import lombok.RequiredArgsConstructor;
import org.gregb884.notification.application.port.in.NotificationUseCase;
import org.gregb884.notification.domain.model.Notification;
import org.gregb884.notification.domain.repository.NotificationRepositoryPort;
import org.gregb884.notification.infrastructure.security.AuthenticatedUser;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService implements NotificationUseCase {


    private final NotificationRepositoryPort notificationRepository;
    private final AuthenticatedUser authenticatedUser;

    @Override
    public List<Notification> getUnreadNotificationsForUser() {
        return notificationRepository.findByUserIdAndReadFalse(authenticatedUser.getUserId());
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}