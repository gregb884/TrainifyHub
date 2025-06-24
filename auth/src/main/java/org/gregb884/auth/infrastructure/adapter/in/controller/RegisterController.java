package org.gregb884.auth.infrastructure.adapter.in.controller;

import jakarta.transaction.Transactional;
import org.gregb884.auth.application.dto.RegisterUserResultDto;
import org.gregb884.auth.application.dto.UserDto;
import org.gregb884.auth.application.port.in.RegisterUserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class RegisterController {

    private final RegisterUserUseCase registerUserUseCase;

    public RegisterController(RegisterUserUseCase registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }


    @Transactional
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto user) {

        if (user.getPassword().equals(user.getConfirmPassword())) {

            RegisterUserResultDto resultDto = registerUserUseCase.registerUser(user);

            if (resultDto.isSuccess()) {

                return ResponseEntity.ok(resultDto.getMessage());

            } else return ResponseEntity.badRequest().body(resultDto.getMessage());

        }

        else return ResponseEntity.badRequest().body("Passwords do not match");
    }

    @PostMapping("/complete-profile")
    public ResponseEntity<String> completeProfileFromExternalLogin(@RequestHeader("Authorization") String token , @RequestBody UserDto userDto){

        RegisterUserResultDto resultDto = registerUserUseCase.fillNewUserData(token, userDto);

        if (resultDto.isSuccess()) return ResponseEntity.ok(resultDto.getMessage());
        else return ResponseEntity.badRequest().body(resultDto.getMessage());
    }


}
