package org.gregb884.auth.infrastructure.service;

import org.gregb884.auth.application.port.in.ActivationUseCase;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ActivationService implements ActivationUseCase {

    private final UserRepositoryPort userRepository;

    public ActivationService(UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean activateAccount(String token) {
        Optional<User> userOpt = userRepository.findByActivationToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setVerified(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}