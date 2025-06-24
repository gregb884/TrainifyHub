package org.gregb884.notification.domain.repository;

import org.gregb884.notification.domain.model.Notification;

import java.util.List;
import java.util.Optional;

public interface NotificationRepositoryPort {


    List<Notification> findByUserIdAndReadFalse(Long userId);

    void save(Notification notification);

    Optional<Notification> findById(Long notificationId);
}
