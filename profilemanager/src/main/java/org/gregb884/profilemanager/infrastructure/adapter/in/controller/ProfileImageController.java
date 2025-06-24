package org.gregb884.profilemanager.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.port.in.ProfileImageUseCase;
import org.gregb884.profilemanager.application.port.in.UserProfileUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profileImage")
public class ProfileImageController {

    private final ProfileImageUseCase profileImageUseCase;

    @GetMapping("/get")
    public ResponseEntity<String> getProfileImage(@RequestParam String userName) {

        try {
           return ResponseEntity.ok(profileImageUseCase.getUserOrTrainerImage(userName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
