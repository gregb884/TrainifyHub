package org.gregb884.profilemanager.service;

import org.gregb884.profilemanager.model.Trainer;
import org.gregb884.profilemanager.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileImageService {


    private final UserService userService;
    private final TrainerService trainerService;


    public ProfileImageService(UserService userService, TrainerService trainerService) {
        this.userService = userService;
        this.trainerService = trainerService;
    }


    public ResponseEntity<String> getUserImage(String userName) {

        Optional<User> user = userService.getUserByUserName(userName);
        Optional<Trainer> trainer = trainerService.getTrainerByUserName(userName);

        if (user.isPresent()) {

            return ResponseEntity.ok(user.get().getImageUrl());

        }

        if (trainer.isPresent()) {

            return ResponseEntity.ok(trainer.get().getImageUrl());
        }

        return ResponseEntity.notFound().build();

    }
}
