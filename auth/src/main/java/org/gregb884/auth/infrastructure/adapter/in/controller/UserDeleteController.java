package org.gregb884.auth.infrastructure.adapter.in.controller;

import org.gregb884.auth.application.port.in.UserDeleteUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserDeleteController {

    private final UserDeleteUseCase userDeleteUseCase;

    public UserDeleteController(UserDeleteUseCase userDeleteUseCase) {
        this.userDeleteUseCase = userDeleteUseCase;
    }


    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestParam long userId) {

        String response =  userDeleteUseCase.deleteUser(userId);

        if (response.equals("Deleted user successfully")) return ResponseEntity.ok(response);
        else return ResponseEntity.badRequest().body(response);

    }
}
