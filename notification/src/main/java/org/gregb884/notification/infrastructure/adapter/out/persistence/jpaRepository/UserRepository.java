package org.gregb884.notification.infrastructure.adapter.out.persistence.jpaRepository;

import org.gregb884.notification.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {


    Boolean existsUserByUsername(String username);

    User findByUsername(String username);

    List<User> findUsersByFcmToken(String fcmToken);

}
