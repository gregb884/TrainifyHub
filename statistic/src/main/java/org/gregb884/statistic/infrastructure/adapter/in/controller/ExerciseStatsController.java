package org.gregb884.statistic.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.application.dto.ExerciseStatsDto;
import org.gregb884.statistic.application.port.in.ExerciseStatisticUseCase;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stats")
public class ExerciseStatsController {


    private final ExerciseStatisticUseCase exerciseStatisticUseCase;

    @PostMapping("/add")
    public ResponseEntity<String> addSet(@RequestBody ExerciseStatsDto exerciseStatsDto) throws Exception {

        try {
            exerciseStatisticUseCase.save(exerciseStatsDto);
            return ResponseEntity.ok("Exercise stats saved");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get1Rm")
    public ResponseEntity<Optional<Double>> get1RM(@RequestParam int exerciseId) {

        Double rm = exerciseStatisticUseCase.calculate1Rm(exerciseId);

        if (rm != null) {
            return ResponseEntity.ok(Optional.of(rm));
        } else return ResponseEntity.notFound().build();


    }

    @GetMapping("/getAllExercises")
    public ResponseEntity<?> getAllExercisesName(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);

        try {
            return ResponseEntity.ok(exerciseStatisticUseCase.getExerciseNames(pageable));
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }


    }

    @GetMapping("/getExerciseDetails")
    public ResponseEntity<?> getExerciseDetails(@RequestParam long exerciseId) {

        try {
            return ResponseEntity.ok(exerciseStatisticUseCase.getExerciseDetails(exerciseId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
