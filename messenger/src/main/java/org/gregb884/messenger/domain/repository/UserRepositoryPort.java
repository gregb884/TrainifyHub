package org.gregb884.messenger.domain.repository;

import org.gregb884.messenger.domain.model.User;

import java.util.Optional;

public interface UserRepositoryPort {

    boolean existsUserByUsername(String username);
    Optional<User> findByUsername(String userName);
    void save(User user1);

    void delete(User user);

    Optional<User> findById(Long userId);
}
