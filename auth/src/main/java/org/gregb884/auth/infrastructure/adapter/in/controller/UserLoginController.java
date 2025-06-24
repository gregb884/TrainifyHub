package org.gregb884.auth.infrastructure.adapter.in.controller;

import org.gregb884.auth.application.dto.ExternalLoginResponseDto;
import org.gregb884.auth.application.dto.UserDto;
import org.gregb884.auth.application.port.in.LoginUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class UserLoginController {


    private final LoginUseCase loginUseCase;


    public UserLoginController(LoginUseCase loginUseCase) {
        this.loginUseCase = loginUseCase;
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto user) {

        String token = loginUseCase.login(user);

        switch (token) {
            case "Banned Account", "Account not active", "Invalid username or password", "" -> {
                return ResponseEntity.status(401).body(token);
            }
        }

        return ResponseEntity.ok(token);

        }


    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestHeader("Authorization") String token){


        ExternalLoginResponseDto loginResponseDto = loginUseCase.googleLogin(token);

        return getResponseEntity(loginResponseDto);

    }

    @PostMapping("/apple")
    public ResponseEntity<?> appleLogin(@RequestHeader("Authorization") String token) {

        ExternalLoginResponseDto loginResponseDto = loginUseCase.appleLogin(token);

        return getResponseEntity(loginResponseDto);

    }

    private ResponseEntity<?> getResponseEntity(ExternalLoginResponseDto loginResponseDto) {
        if (!loginResponseDto.getError().isEmpty()) {
            return ResponseEntity.status(401).body(loginResponseDto.getError());
        }

        if (loginResponseDto.isNewUser()){

            return ResponseEntity.ok("newUser");
        }

        if (loginResponseDto.getAccessToken() != null && !loginResponseDto.getAccessToken().isEmpty()) {
            return ResponseEntity.ok("token:"+loginResponseDto.getAccessToken());
        }

        return ResponseEntity.badRequest().build();
    }


}



