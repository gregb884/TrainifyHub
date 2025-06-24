package org.gregb884.notification.infrastructure.adapter.out.persistence.jpaRepository;

import org.gregb884.notification.domain.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdAndReadFalse(Long userId);

}
