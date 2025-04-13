package org.gregb884.statistic.controller;
import org.gregb884.statistic.dto.ExerciseNameDto;
import org.gregb884.statistic.dto.ExerciseStatsDto;
import org.gregb884.statistic.dto.ExerciseStatsDtoDetails;
import org.gregb884.statistic.model.ExerciseStats;
import org.gregb884.statistic.service.ExerciseStatsService;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stats")
public class ExerciseStatsController {

    private final ExerciseStatsService exerciseStatsService;

    public ExerciseStatsController(ExerciseStatsService exerciseStatsService) {
        this.exerciseStatsService = exerciseStatsService;
    }


    @PostMapping("/add")
    public ResponseEntity<String> addSet(@RequestBody ExerciseStatsDto exerciseStatsDto) throws Exception {


        return exerciseStatsService.save(exerciseStatsDto);

    }

    @GetMapping("/get1Rm")
    public ResponseEntity<Optional<Double>> get1RM(@RequestParam int exerciseId) {

        return exerciseStatsService.calculate1Rm(exerciseId);

    }

    @GetMapping("/getAllExercises")
    public ResponseEntity<Page<ExerciseNameDto>> getAllExercisesName(@RequestParam(defaultValue = "0") int page,
                                                                           @RequestParam(defaultValue = "20") int size) throws Exception {
        return exerciseStatsService.getAllExercisesName(page,size);

    }

    @GetMapping("/getExerciseDetails")
    public ResponseEntity<List<ExerciseStatsDtoDetails>> getExerciseDetails(@RequestParam long exerciseId) throws Exception {

        return exerciseStatsService.getExerciseDetails(exerciseId);

    }

}
