package org.gregb884.trainingmanager.domain.repository;


import org.gregb884.trainingmanager.domain.model.User;

import java.util.Optional;

public interface UserRepositoryPort {

    Boolean existsUserByUsername(String username);

    User findByUsername(String username);

    Optional<User> findById(Long id);

    void save(User user1);

    void delete(User user);
}
