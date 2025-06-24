package org.gregb884.messenger.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.application.dto.UserDto;
import org.gregb884.messenger.application.port.in.UserUseCase;
import org.gregb884.messenger.domain.model.User;
import org.gregb884.messenger.infrastructure.adapter.out.persistence.repositoryAdapter.UserRepositoryAdapter;
import org.gregb884.messenger.infrastructure.security.AuthenticatedUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserUseCase {

    private final UserRepositoryAdapter userRepository;
    private final AuthenticatedUser authenticatedUser;


    @Override
    public boolean saveNewUser(UserDto userDto) {

        if (userRepository.existsUserByUsername(userDto.getUsername())) {

            return false;
        }

        User user1 = new User();

        user1.setUsername(userDto.getUsername());
        user1.setFirstName(userDto.getFirstName());
        user1.setLastName(userDto.getLastName());
        user1.setId(userDto.getId());

        userRepository.save(user1);

        return true;
    }

    @Override
    public boolean deleteUser() {
        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {

            userRepository.delete(user.get());

            return true;

        }
        return false;
    }

    @Override
    public String getUserName(Principal principal) {

        return authenticatedUser.getUserName(principal);

    }


}
