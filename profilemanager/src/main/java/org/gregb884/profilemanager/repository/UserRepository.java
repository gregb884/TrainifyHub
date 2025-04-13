package org.gregb884.profilemanager.repository;

import org.gregb884.profilemanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {


    boolean existsUserByUsername(String username);

    Optional<User> findUserByUsername(String username);

}
