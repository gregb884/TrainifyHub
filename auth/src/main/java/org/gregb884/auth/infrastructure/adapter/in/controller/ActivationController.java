package org.gregb884.auth.infrastructure.adapter.in.controller;

import org.gregb884.auth.application.port.in.ActivationUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/activate")
public class ActivationController {

    private final ActivationUseCase activationUseCase;

    public ActivationController(ActivationUseCase activationUseCase) {
        this.activationUseCase = activationUseCase;
    }

    @GetMapping
    public ResponseEntity<String> activate(@RequestParam String token) {


        if (activationUseCase.activateAccount(token)){

           return ResponseEntity.ok("Account activated");
        }

        return ResponseEntity.badRequest().body("Invalid activation token");
    }
}