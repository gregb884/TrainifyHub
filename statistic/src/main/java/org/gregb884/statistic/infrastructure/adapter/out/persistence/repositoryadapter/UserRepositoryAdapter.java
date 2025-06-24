package org.gregb884.statistic.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.domain.model.User;
import org.gregb884.statistic.domain.repository.UserRepositoryPort;
import org.gregb884.statistic.infrastructure.adapter.out.persistence.jparepository.UserRepository;
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
    public void save(User user) {
        userRepository.save(user);
    }

    @Override
    public Optional<User> findById(long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public void delete(User user) {
        userRepository.delete(user);
    }


}
