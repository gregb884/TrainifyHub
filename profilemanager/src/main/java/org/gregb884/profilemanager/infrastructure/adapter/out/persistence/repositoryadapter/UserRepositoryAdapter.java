package org.gregb884.profilemanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.domain.model.User;
import org.gregb884.profilemanager.domain.repository.UserRepositoryPort;
import org.gregb884.profilemanager.infrastructure.adapter.out.persistence.jparepository.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final UserRepository userRepository;

    @Override
    public boolean existsUserByUsername(String username) {
        return userRepository.existsUserByUsername(username);
    }

    @Override
    public Optional<User> findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    @Override
    public void save(User user) {

        userRepository.save(user);
    }

    @Override
    public void delete(User user) {

        userRepository.delete(user);
    }
}
