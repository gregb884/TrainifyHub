package org.gregb884.trainingmanager.controller;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.dto.ExerciseDto;
import org.gregb884.trainingmanager.dto.ExerciseSeriesDto;
import org.gregb884.trainingmanager.model.ExerciseSeries;
import org.gregb884.trainingmanager.service.ExerciseSeriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/exerciseSeries")
public class ExerciseSeriesController {


    private final ExerciseSeriesService exerciseSeriesService;

    public ExerciseSeriesController(ExerciseSeriesService exerciseSeriesService) {
        this.exerciseSeriesService = exerciseSeriesService;
    }


    @PostMapping("/edit")
    @Transactional
    public ResponseEntity<String> EditExerciseSeries(@RequestBody ExerciseSeriesDto exerciseSeriesDto,
                                                             @RequestParam long id) {

        try {
            Optional<ExerciseSeries> exerciseSeries1 = exerciseSeriesService.edit(id, exerciseSeriesDto);
        } catch (NoSuchElementException e) {

            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok("Successfully edited exercise series");
    }


}
