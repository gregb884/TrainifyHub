package org.gregb884.notification.application.port.in;

import org.gregb884.notification.application.dto.UserDto;
import org.gregb884.notification.domain.model.User;

public interface UserUseCase {


    boolean saveNewUser(UserDto userDto);
    User getUserByEmail(String email);
    boolean deleteUser();

}
