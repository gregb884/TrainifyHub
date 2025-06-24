package org.gregb884.auth.infrastructure.service;
import org.gregb884.auth.application.port.in.UserDeleteUseCase;
import org.gregb884.auth.application.port.out.ExternalUserModulePort;
import org.gregb884.auth.application.port.out.TokenServicePort;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@ConditionalOnProperty(name = "google.play.json")
public class UserDeleteService implements UserDeleteUseCase {

    private final ExternalUserModulePort externalUserModulePort;
    private final UserRepositoryPort userRepository;
    private final TokenServicePort tokenServicePort;

    public UserDeleteService(ExternalUserModulePort externalUserModulePort, UserRepositoryPort userRepository, TokenServicePort tokenServicePort) {
        this.externalUserModulePort = externalUserModulePort;
        this.userRepository = userRepository;
        this.tokenServicePort = tokenServicePort;
    }


    @Override
    public String deleteUser(long id) {

        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {

            List<String> errors = externalUserModulePort.deleteInAllModules(user.get(), tokenServicePort.generateToken(user.get()));

            if (errors.isEmpty()) {
                userRepository.deleteById(user.get().getId());

                return "Deleted user successfully";
            } else return errors.toString();

        }

        return "User not found";
    }
}
