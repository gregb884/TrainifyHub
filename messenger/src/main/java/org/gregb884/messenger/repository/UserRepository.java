package org.gregb884.messenger.repository;

import org.gregb884.messenger.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {


    boolean existsUserByUsername(String username);

    Optional<User> findByUsername(String userName);
}
