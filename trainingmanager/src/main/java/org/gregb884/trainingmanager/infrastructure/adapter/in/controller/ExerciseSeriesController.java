package org.gregb884.trainingmanager.infrastructure.adapter.in.controller;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.ExerciseSeriesDto;
import org.gregb884.trainingmanager.application.port.in.ExerciseSeriesUseCase;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/exerciseSeries")
public class ExerciseSeriesController {


    private final ExerciseSeriesUseCase exerciseSeriesUseCase;


    @PostMapping("/edit")
    @Transactional
    public ResponseEntity<String> EditExerciseSeries(@RequestBody ExerciseSeriesDto exerciseSeriesDto,
                                                             @RequestParam long id) {

        try {
            exerciseSeriesUseCase.edit(id, exerciseSeriesDto);

            return ResponseEntity.ok("Successfully edited exercise series");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
