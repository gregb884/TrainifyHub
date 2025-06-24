package org.gregb884.profilemanager.application.port.in;

import org.gregb884.profilemanager.application.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.application.dto.UserDto;
import org.gregb884.profilemanager.domain.model.User;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

public interface UserProfileUseCase {

    Optional<User> getUserByUsername(String username) throws Exception;

    boolean saveNewUser(UserAndTrainerDtoForCreate userAndTrainerDtoForCreate);

    boolean deleteUser();

    User getMyProfile() throws Exception;

    String editMyProfile(UserDto userDto) throws Exception;

    void setNewImageUrl(String userImageUrl);
}
