package org.gregb884.messenger.application.port.in;

import org.gregb884.messenger.application.dto.UserDto;
import org.springframework.security.core.Authentication;

import java.security.Principal;

public interface UserUseCase {

    boolean saveNewUser(UserDto userDto);

    boolean deleteUser();

    String getUserName(Principal principal);
}
