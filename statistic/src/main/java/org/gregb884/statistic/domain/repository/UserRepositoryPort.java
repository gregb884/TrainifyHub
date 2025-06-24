package org.gregb884.statistic.domain.repository;

import org.gregb884.statistic.domain.model.User;

import java.util.Optional;

public interface UserRepositoryPort {

    boolean existsUserByUsername(String username);

    void save(User user);

    Optional<User> findById(long userId);

    void delete(User user);
}
