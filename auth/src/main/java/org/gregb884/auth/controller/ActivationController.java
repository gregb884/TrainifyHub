package org.gregb884.auth.controller;

import org.gregb884.auth.model.User;
import org.gregb884.auth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/activate")
public class ActivationController {

    private final UserRepository userRepository;

    public ActivationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<String> activateAccount(@RequestParam String token) {

        Optional<User> user = userRepository.findByActivationToken(token);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("Token Not Found");
        }

        user.get().setVerified(true);
        userRepository.save(user.get());

        return ResponseEntity.ok("Activated");
    }
}