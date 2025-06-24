package org.gregb884.notification.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.notification.application.dto.UserDto;
import org.gregb884.notification.application.port.in.FcmTokenUseCase;
import org.gregb884.notification.application.port.in.UserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {


    private final UserUseCase userUseCase;
    private final FcmTokenUseCase fcmTokenUseCase;

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {


        if (userUseCase.saveNewUser(userDto)) {
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

    @PostMapping("/addFCM")
    public ResponseEntity<String> AddFcm(@RequestParam String fcmToken) {

        try {
            fcmTokenUseCase.addFcmToken(fcmToken);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/getFCM")
    public ResponseEntity<String> GetFcm() {

        try {
           String fcm = fcmTokenUseCase.getFcm();
           return ResponseEntity.ok(fcm);

        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PostMapping("/deleteFCM")
    public ResponseEntity<String> deleteFCM() {

        try {
            fcmTokenUseCase.deleteFCM();
            return ResponseEntity.ok().build();
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
