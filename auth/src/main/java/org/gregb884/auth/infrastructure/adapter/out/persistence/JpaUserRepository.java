package org.gregb884.auth.infrastructure.adapter.out.persistence;

import org.gregb884.auth.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    @Query("SELECT u.loginCount FROM User u WHERE u.id = :id")
    Optional<Integer> countLoginById(@Param("id") Long id);

    Optional<User> findByActivationToken(String activationToken);

    boolean existsUserByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsernameOptional(@Param("username") String username);
}