package org.gregb884.trainingmanager.repository;

import org.gregb884.trainingmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {


    Boolean existsUserByUsername(String username);

    User findByUsername(String username);

}
