package org.gregb884.messenger.infrastructure.adapter.out.persistence.repositoryAdapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.domain.model.User;
import org.gregb884.messenger.domain.repository.UserRepositoryPort;
import org.gregb884.messenger.infrastructure.adapter.out.persistence.jpaRepository.UserRepository;
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
    public Optional<User> findByUsername(String userName) {
       return userRepository.findByUsername(userName);
    }

    @Override
    public void save(User user1) {
            userRepository.save(user1);
    }

    @Override
    public void delete(User user) {
        userRepository.delete(user);
    }

    @Override
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

}
