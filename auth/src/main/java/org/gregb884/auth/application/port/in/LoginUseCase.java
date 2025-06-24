package org.gregb884.auth.application.port.in;

import org.gregb884.auth.application.dto.ExternalLoginResponseDto;
import org.gregb884.auth.application.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;

public interface LoginUseCase {

    String login(UserDto userDto);
    ExternalLoginResponseDto googleLogin(String token);
    ExternalLoginResponseDto appleLogin(String token);
}