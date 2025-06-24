package org.gregb884.notification.infrastructure.adapter.out.persistence.repositoryAdapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.notification.domain.model.Notification;
import org.gregb884.notification.domain.repository.NotificationRepositoryPort;
import org.gregb884.notification.infrastructure.adapter.out.persistence.jpaRepository.NotificationRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class NotificationRepositoryAdapter implements NotificationRepositoryPort {

        private final NotificationRepository notificationRepository;

        @Override
        public List<Notification> findByUserIdAndReadFalse(Long userId) {
            return notificationRepository.findByUserIdAndReadFalse(userId);
        }

    @Override
    public void save(Notification notification) {
        notificationRepository.save(notification);
    }

    @Override
    public Optional<Notification> findById(Long notificationId) {
        return notificationRepository.findById(notificationId);
    }


}
