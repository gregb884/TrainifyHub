package org.gregb884.notification.infrastructure.adapter.out.persistence.repositoryAdapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.notification.domain.model.User;
import org.gregb884.notification.domain.repository.UserRepositoryPort;
import org.gregb884.notification.infrastructure.adapter.out.persistence.jpaRepository.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {


    private final UserRepository userRepository;


    @Override
    public Boolean existsUserByUsername(String username) {
        return userRepository.existsUserByUsername(username);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> findUsersByFcmToken(String fcmToken) {
        return userRepository.findUsersByFcmToken(fcmToken);
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }

    @Override
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public void delete(User user) {
        userRepository.delete(user);
    }
}
