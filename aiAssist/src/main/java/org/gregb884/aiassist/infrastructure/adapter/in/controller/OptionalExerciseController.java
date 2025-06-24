package org.gregb884.aiassist.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.port.in.OptionalExerciseFetcherUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/optionalExercise")
public class OptionalExerciseController {

    private final OptionalExerciseFetcherUseCase optionalExerciseFetcherUseCase;


    @PostMapping("/setTrue")
    public ResponseEntity<String> setChoseExercise(@RequestParam long aiExerciseId, @RequestParam long optionalExerciseId) {

        if (optionalExerciseFetcherUseCase.setChose(aiExerciseId,optionalExerciseId)){
            return ResponseEntity.ok().body("Optional exercise selected successfully.");
        } else return ResponseEntity.badRequest().build();
    }
}
