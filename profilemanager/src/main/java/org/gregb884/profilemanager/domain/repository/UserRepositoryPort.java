package org.gregb884.profilemanager.domain.repository;

import org.gregb884.profilemanager.domain.model.User;

import java.util.Optional;

public interface UserRepositoryPort {

    boolean existsUserByUsername(String username);

    Optional<User> findUserByUsername(String username);

    void save(User user);

    void delete(User user);
}
