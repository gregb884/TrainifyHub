package org.gregb884.notification.domain.repository;

import org.gregb884.notification.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepositoryPort {

    Boolean existsUserByUsername(String username);

    User findByUsername(String username);

    List<User> findUsersByFcmToken(String fcmToken);

    void save(User user);

    Optional<User> findById(Long userId);

    void delete(User user);
}
