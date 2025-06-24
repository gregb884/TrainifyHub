package org.gregb884.auth.infrastructure.adapter.out.persistence;

import lombok.RequiredArgsConstructor;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryPort {

    private final JpaUserRepository jpaUserRepository;

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaUserRepository.findByUsername(username);
    }

    @Override
    public Optional<Integer> countLoginById(Long id) {
        return jpaUserRepository.countLoginById(id);
    }

    @Override
    public Optional<User> findByActivationToken(String activationToken) {
        return jpaUserRepository.findByActivationToken(activationToken);
    }

    @Override
    public boolean existsUserByUsername(String username) {
        return jpaUserRepository.existsUserByUsername(username);
    }

    @Override
    public Optional<User> findByUsernameOptional(String username) {
        return jpaUserRepository.findByUsernameOptional(username);
    }

    @Override
    public User save(User user) {
        return jpaUserRepository.save(user);
    }

    @Override
    public void delete(User user) {
        jpaUserRepository.delete(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return jpaUserRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        jpaUserRepository.deleteById(id);
    }
}