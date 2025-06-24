package org.gregb884.auth.infrastructure.service;

import org.gregb884.auth.application.port.in.AiCoinUseCase;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AiCoinService implements AiCoinUseCase {

    private final UserRepositoryPort userRepository;
    private final AuthenticatedUser authenticatedUser;


    public AiCoinService(UserRepositoryPort userRepository, AuthenticatedUser authenticatedUser) {
        this.userRepository = userRepository;
        this.authenticatedUser = authenticatedUser;
    }

    private Long getUserId() {

        return authenticatedUser.getUserId();
    }

    @Override
    public Integer checkAiCoins() {
        Optional<User> user = userRepository.findById(getUserId());

        return user.map(u -> {
            if (u.getAiCoins() == null) return 0;
            return u.getAiCoins();
        }).orElse(0);
    }

    @Override
    public boolean consumeAiCoin() {
        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {
            User u = user.get();
            int coins = u.getAiCoins() != null ? u.getAiCoins() : 0;

            if (coins > 0) {
                u.setAiCoins(coins - 1);
                userRepository.save(u);
                return true;
            }

            return false;
        }

        return false;
    }

    @Override
    public boolean addOneAiCoin() {
        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {
            User u = user.get();
            u.setAiCoins((u.getAiCoins() == null ? 0 : u.getAiCoins()) + 1);
            userRepository.save(u);
            return true;
        }

        return false;
    }
}