package org.gregb884.trainingmanager.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.dto.UserDto;
import org.gregb884.trainingmanager.application.port.in.TrainingPlanUseCase;
import org.gregb884.trainingmanager.application.port.in.UserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {


    private final UserUseCase userUseCase;
    private final TrainingPlanUseCase trainingPlanUseCase;


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {

        if(userUseCase.saveNewUser(userDto))
        {
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


    @GetMapping("/countClient")
    public ResponseEntity<Long> countClient() {

       return ResponseEntity.ok(trainingPlanUseCase.countTraineeWithMyTrainingPlans());

    }

    @GetMapping("/myClient")
    public ResponseEntity<List<String>> myClientList() {

        return ResponseEntity.ok(trainingPlanUseCase.listTraineeWithMyTrainingPlans());

    }



}
