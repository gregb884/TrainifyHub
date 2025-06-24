package org.gregb884.messenger.infrastructure.adapter.in.controller;


import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.application.dto.UserDto;
import org.gregb884.messenger.application.port.in.UserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {


    private final UserUseCase userUseCase;

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {

        if(userUseCase.saveNewUser(userDto))
        {
            return ResponseEntity.ok("User created");
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {

        if(userUseCase.deleteUser()){
            return ResponseEntity.ok("User deleted");
        }
        return ResponseEntity.badRequest().build();
    }
}
