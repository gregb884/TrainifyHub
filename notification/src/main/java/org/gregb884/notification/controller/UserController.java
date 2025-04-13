package org.gregb884.notification.controller;

import org.gregb884.notification.dto.UserDto;
import org.gregb884.notification.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {


        if (userService.saveNewUser(userDto)) {
            return ResponseEntity.ok("User created");
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {

        if(userService.deleteUser()){

            return ResponseEntity.ok("User deleted");
        }

        return ResponseEntity.badRequest().build();

    }

    @PostMapping("/addFCM")
    public ResponseEntity<Void> AddFcm(@RequestParam String fcmToken) {

        return userService.addFcmToken(fcmToken);

    }

    @GetMapping("/getFCM")
    public ResponseEntity<String> GetFcm() {
        return userService.getFcm();
    }

    @PostMapping("/deleteFCM")
    public ResponseEntity<String> deleteFCM() {
        return userService.deleteFCM();
    }


}
