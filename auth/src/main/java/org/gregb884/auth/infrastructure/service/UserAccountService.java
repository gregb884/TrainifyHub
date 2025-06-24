package org.gregb884.auth.infrastructure.service;

import org.gregb884.auth.application.dto.ResponseDto;
import org.gregb884.auth.application.port.in.UserAccountUseCase;
import org.gregb884.auth.application.port.in.UserDeleteUseCase;
import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.security.AuthenticatedUser;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@ConditionalOnProperty(name = "google.play.json")
public class UserAccountService implements UserAccountUseCase {

    private final UserRepositoryPort userRepository;
    private final AuthenticatedUser authenticatedUser;
    private final UserDeleteUseCase userDeleteUseCase;

    public UserAccountService(UserRepositoryPort userRepository, AuthenticatedUser authenticatedUser, UserDeleteUseCase userDeleteUseCase) {
        this.userRepository = userRepository;
        this.authenticatedUser = authenticatedUser;
        this.userDeleteUseCase = userDeleteUseCase;
    }

    @Override
    public boolean checkExist(String userName) {
        String role = authenticatedUser.getRole();
        return "ROLE_TRAINER".equals(role) && userRepository.existsUserByUsername(userName);
    }

    @Override
    public String checkLang(String userName) {
        return userRepository.findByUsernameOptional(userName)
                .map(User::getLang)
                .orElse("");
    }

    @Override
    public ResponseDto readyPlansAccessCheck() {
        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {
            if (user.get().getReadyMadePlansAccess() == null) {
                return new ResponseDto("Access denied");
            }

            if (user.get().getReadyMadePlansAccess().toInstant().isAfter(java.time.Instant.now())) {
                return new ResponseDto("Access");
            } else {
                return new ResponseDto("Access expired");
            }
        }
        return new ResponseDto("User not found");
    }

    @Override
    public ResponseDto subscriptionEndDate() {

        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent() && user.get().getReadyMadePlansAccess() != null) {
            return new ResponseDto(user.get().getReadyMadePlansAccess().toString());
        }

        return new ResponseDto("Null");

    }

    @Override
    public ResponseDto loginCount() {
        Optional<Integer> loginCount = userRepository.countLoginById(authenticatedUser.getUserId());
        String count = loginCount.map(Object::toString).orElse("0");
        return new ResponseDto(count);
    }

    @Override
    public void loginPlus() {

        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {

            user.get().setLoginCount(user.get().getLoginCount() + 1);

            userRepository.save(user.get());

        }

    }

    @Override
    public ResponseDto deleteMyAccount() {

        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());
        if (user.isPresent()) {

            userDeleteUseCase.deleteUser(user.get().getId());

            return new ResponseDto("Deleted");
        }

        return new ResponseDto("User not found");
    }


}