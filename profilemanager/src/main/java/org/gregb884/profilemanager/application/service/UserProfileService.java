package org.gregb884.profilemanager.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.application.dto.UserDto;
import org.gregb884.profilemanager.application.mapper.CreateUserFromDtoMapper;
import org.gregb884.profilemanager.application.mapper.EditUserProfileMapper;
import org.gregb884.profilemanager.application.port.in.UserProfileUseCase;
import org.gregb884.profilemanager.domain.model.User;
import org.gregb884.profilemanager.domain.repository.UserRepositoryPort;
import org.gregb884.profilemanager.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService implements UserProfileUseCase {

    private final UserRepositoryPort userRepository;
    private final CreateUserFromDtoMapper createUserFromDtoMapper;
    private final AuthenticatedUser authenticatedUser;
    private final EditUserProfileMapper editUserProfileMapper;

    @Override
    public Optional<User> getUserByUsername(String username) {

       return userRepository.findUserByUsername(username);

    }

    @Override
    public boolean saveNewUser(UserAndTrainerDtoForCreate userAndTrainerDtoForCreate) {

        if (userRepository.existsUserByUsername(userAndTrainerDtoForCreate.getUsername())) {

            return false;
        }

        User user = createUserFromDtoMapper.toDomain(userAndTrainerDtoForCreate);

        userRepository.save(user);
        return true;

    }

    @Override
    public boolean deleteUser() {

        Optional<User> user = userRepository.findUserByUsername(authenticatedUser.getEmail());
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return true;
        } else return false;
    }

    @Override
    public User getMyProfile() throws Exception {

        Optional<User> user = userRepository.findUserByUsername(authenticatedUser.getEmail());

        if (user.isPresent()) {
            return user.get();
        } else throw new Exception("User not found");

    }

    @Override
    public String editMyProfile(UserDto userDto) throws Exception {

        Optional<User> user = userRepository.findUserByUsername(authenticatedUser.getEmail());

        if (user.isPresent()) {

            User userAfterEdit = editUserProfileMapper.toDomain(userDto);
            userAfterEdit.setId(user.get().getId());
            userRepository.save(userAfterEdit);

            return "Profile updated successfully";

        } else throw new Exception("User not found");

    }

    @Override
    public void setNewImageUrl(String userImageUrl) {

        Optional<User> user = userRepository.findUserByUsername(authenticatedUser.getEmail());

        if (user.isPresent()) {
            user.get().setImageUrl(userImageUrl);
            userRepository.save(user.get());
        }
    }

}
