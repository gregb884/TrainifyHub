package org.gregb884.auth.repository;

import org.gregb884.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    @Query("SELECT u.loginCount FROM User u WHERE u.id = :id")
    Optional<Integer> countLoginById(@RequestParam Long id);

    Optional<User> findByActivationToken(String activationToken);

    boolean existsUserByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsernameOptional(@Param("username") String username);
}
