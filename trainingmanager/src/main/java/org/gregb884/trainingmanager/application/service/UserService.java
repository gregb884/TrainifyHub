package org.gregb884.trainingmanager.application.service;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.UserDto;
import org.gregb884.trainingmanager.application.port.in.TrainingPlanUseCase;
import org.gregb884.trainingmanager.application.port.in.UserUseCase;
import org.gregb884.trainingmanager.domain.model.User;
import org.gregb884.trainingmanager.domain.repository.UserRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserService implements UserUseCase {

    private final UserRepositoryPort userRepository;
    private final AuthenticatedUser authenticatedUser;


    @Override
    public String getTrainerEmailById(long id) throws Exception {

        Optional<User> trainer = userRepository.findById(id);

        if (trainer.isPresent()) {

            return trainer.get().getUsername();
        } else throw new Exception("Trainer not found");

    }


    @Override
    public boolean saveNewUser(UserDto userDto) {

        if (userRepository.existsUserByUsername(userDto.getUsername())) {

            return false;
        }

        User user1 = new User();

        user1.setUsername(userDto.getUsername());
        user1.setId(userDto.getId());

        userRepository.save(user1);

        return true;

    }

    @Override
    public Set<User> findByUserName(String email) {

        Set<User> users = new HashSet<>();
        User user = userRepository.findByUsername(email);
        users.add(user);
        return users;
    }


    @Override
    public User findById(long id) {

        return userRepository.findById(id).orElse(null);
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
