package org.gregb884.notification.application.port.in;

import org.gregb884.notification.domain.model.Notification;

import java.util.List;

public interface NotificationUseCase {

    List<Notification> getUnreadNotificationsForUser();
    void markAsRead(Long notificationId);
}
