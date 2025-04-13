package org.gregb884.aiassist.controller;

import org.gregb884.aiassist.service.OptionalExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/optionalExercise")
public class OptionalExerciseController {


    private final OptionalExerciseService optionalExerciseService;

    public OptionalExerciseController(OptionalExerciseService optionalExerciseService) {
        this.optionalExerciseService = optionalExerciseService;
    }


    @PostMapping("/setTrue")
    public ResponseEntity<String> setChoseExercise(@RequestParam long aiExerciseId,@RequestParam long optionalExerciseId) {


        return optionalExerciseService.setChose(aiExerciseId,optionalExerciseId);


    }



}
