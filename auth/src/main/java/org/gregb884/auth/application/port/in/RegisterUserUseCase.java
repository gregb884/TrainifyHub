package org.gregb884.auth.application.port.in;

import org.gregb884.auth.application.dto.RegisterUserResultDto;
import org.gregb884.auth.application.dto.UserDto;
import org.springframework.http.ResponseEntity;

public interface RegisterUserUseCase {

    RegisterUserResultDto registerUser(UserDto userDto);

    RegisterUserResultDto fillNewUserData(String token, UserDto userDto);


}