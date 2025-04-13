package org.gregb884.notification.repository;

import org.gregb884.notification.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {


    Boolean existsUserByUsername(String username);

    User findByUsername(String username);

    List<User> findUsersByFcmToken(String fcmToken);

}