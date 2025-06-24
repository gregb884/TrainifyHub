package org.gregb884.statistic.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.application.dto.UserDto;
import org.gregb884.statistic.application.mapper.UserDtoMapper;
import org.gregb884.statistic.application.port.in.UserUseCase;
import org.gregb884.statistic.domain.model.User;
import org.gregb884.statistic.domain.repository.UserRepositoryPort;
import org.gregb884.statistic.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserUseCase {

    private final UserRepositoryPort userRepository;
    private final UserDtoMapper userDtoMapper;
    private final AuthenticatedUser authenticatedUser;

    @Override
    public boolean saveNewUser(UserDto userDto) {

        if (userRepository.existsUserByUsername(userDto.getUsername())) {

            return false;
        }

        User user = userDtoMapper.toDomain(userDto);
        userRepository.save(user);

        return true;

    }

    @Override
    public User getUser(long userId) {

        Optional<User> user = userRepository.findById(userId);

        return user.orElse(null);
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
