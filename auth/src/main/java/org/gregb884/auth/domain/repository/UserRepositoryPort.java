package org.gregb884.auth.domain.repository;

import org.gregb884.auth.domain.model.User;

import java.util.Optional;

public interface UserRepositoryPort {


    Optional<User> findByUsername(String username);

    Optional<Integer> countLoginById(Long id);

    Optional<User> findByActivationToken(String activationToken);

    boolean existsUserByUsername(String username);

    Optional<User> findByUsernameOptional(String username);

    User save(User user);

    void delete(User user);

    Optional<User> findById(Long id);

    void deleteById(Long id);


}