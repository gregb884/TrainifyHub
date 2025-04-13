package org.gregb884.profilemanager.controller;

import org.gregb884.profilemanager.service.ProfileImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profileImage")
public class ProfileimageController {


    private final ProfileImageService profileImageService;

    public ProfileimageController(ProfileImageService profileImageService) {
        this.profileImageService = profileImageService;
    }

    @GetMapping("/get")
    public ResponseEntity<String> getProfileImage(@RequestParam String userName) {

        return profileImageService.getUserImage(userName);


    }

}
