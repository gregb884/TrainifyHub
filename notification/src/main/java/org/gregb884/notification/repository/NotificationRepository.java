package org.gregb884.notification.repository;

import org.gregb884.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdAndReadFalse(Long userId);

}
