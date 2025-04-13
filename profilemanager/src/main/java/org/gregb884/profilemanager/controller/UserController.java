package org.gregb884.profilemanager.controller;

import org.gregb884.profilemanager.dto.TrainerDto;
import org.gregb884.profilemanager.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.dto.UserDto;
import org.gregb884.profilemanager.model.Trainer;
import org.gregb884.profilemanager.model.User;
import org.gregb884.profilemanager.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserAndTrainerDtoForCreate userAndTrainerDtoForCreate) {



        if(userService.saveNewUser(userAndTrainerDtoForCreate))
        {
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

    @GetMapping("/getMyProfile")
    public ResponseEntity<User> getMyProfile() {

        return userService.getMyProfile();
    }


    @PostMapping("/editMyProfile")
    public ResponseEntity<String> editMyProfile(@RequestBody UserDto userDto) {

        return userService.editMyProfile(userDto);
    }

    @PostMapping("/uploadImage")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {


        try {
            String imageUrl = userService.saveProfileImage(file);

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
