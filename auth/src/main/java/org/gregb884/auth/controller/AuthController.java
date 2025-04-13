package org.gregb884.auth.controller;

import jakarta.transaction.Transactional;
import org.gregb884.auth.dto.UserDto;
import org.gregb884.auth.model.User;
import org.gregb884.auth.service.UserService;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }


    @Transactional
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto user) {

        if (user.getPassword().equals(user.getConfirmPassword())) {

           return userService.saveUser(user);

        }

        else return ResponseEntity.badRequest().body("Passwords do not match");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto user) {

        return userService.login(user);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestHeader("Authorization") String token){

        return userService.googleLogin(token);

    }

    @PostMapping("/apple")
    public ResponseEntity<?> appleLogin(@RequestHeader("Authorization") String token) {

        return userService.appleLogin(token);

    }

    @PostMapping("/complete-profile")
    public ResponseEntity<String> completeProfileGoogle(@RequestHeader("Authorization") String token , @RequestBody UserDto userDto){

        return userService.newUserDataFill(token, userDto);

    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestParam long userId) {

        return userService.deleteUser(userId);

    }

    @DeleteMapping("/deleteAllUsers")
    public ResponseEntity<String> deleteAllUsers() {

      return   userService.deleteAllUsers();

    }



}
