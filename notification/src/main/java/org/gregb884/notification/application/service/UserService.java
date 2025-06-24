package org.gregb884.notification.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.notification.application.dto.UserDto;
import org.gregb884.notification.application.mapper.UserDtoMapper;
import org.gregb884.notification.application.port.in.UserUseCase;
import org.gregb884.notification.domain.model.User;
import org.gregb884.notification.domain.repository.UserRepositoryPort;
import org.gregb884.notification.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserUseCase {

    private final UserRepositoryPort userRepository;
    private final AuthenticatedUser authenticatedUser;
    private final UserDtoMapper userDtoMapper;


    @Override
    public boolean saveNewUser(UserDto userDto) {

        if (userRepository.existsUserByUsername(userDto.getUsername())) {

            return false;
        }

        User user1 = userDtoMapper.toDomain(userDto);

        userRepository.save(user1);

        return true;

    }

    @Override
    public User getUserByEmail(String email) {

       return userRepository.findByUsername(email);
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


}
