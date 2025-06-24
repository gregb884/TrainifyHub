package org.gregb884.profilemanager.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.application.dto.UserDto;
import org.gregb884.profilemanager.application.port.in.ProfileImageUseCase;
import org.gregb884.profilemanager.application.port.in.UserProfileUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profile/user")
public class UserController {


    private final UserProfileUseCase userProfileUseCase;
    private final ProfileImageUseCase profileImageUseCase;


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserAndTrainerDtoForCreate userAndTrainerDtoForCreate) {

        if(userProfileUseCase.saveNewUser(userAndTrainerDtoForCreate))
        {
            return ResponseEntity.ok("User created");
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {

        if(userProfileUseCase.deleteUser()){
            return ResponseEntity.ok("User deleted");
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/getMyProfile")
    public ResponseEntity<?> getMyProfile() {
        try {
            return ResponseEntity.ok(userProfileUseCase.getMyProfile());
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/editMyProfile")
    public ResponseEntity<String> editMyProfile(@RequestBody UserDto userDto) {

        try {
           return ResponseEntity.ok(userProfileUseCase.editMyProfile(userDto));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/uploadImage")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {


        try {
            String imageUrl = profileImageUseCase.saveProfileImage(file);

            if(imageUrl != null) {

                Map<String, String> response = new HashMap<>();
                response.put("imageUrl", imageUrl);
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest().build();

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
