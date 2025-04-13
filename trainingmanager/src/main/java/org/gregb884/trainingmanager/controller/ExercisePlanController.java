package org.gregb884.trainingmanager.controller;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.dto.ExercisePlanDto;
import org.gregb884.trainingmanager.model.Day;
import org.gregb884.trainingmanager.model.ExercisePlan;
import org.gregb884.trainingmanager.service.ExercisePlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/exercisePlan")
public class ExercisePlanController {


   private final ExercisePlanService exercisePlanService;

    public ExercisePlanController(ExercisePlanService exercisePlanService) {
        this.exercisePlanService = exercisePlanService;
    }


    @PostMapping("/create")
    @Transactional
    public ResponseEntity<String> createExercisePlan(@RequestBody ExercisePlanDto exercisePlanDto,
                                                     @RequestParam long dayId,
                                                     @RequestParam long exerciseId) {

       return exercisePlanService.create(dayId,exercisePlanDto,exerciseId);

    }

    @PostMapping("/edit")
    @Transactional
    public ResponseEntity<String> editExercisePlan(@RequestBody ExercisePlanDto exercisePlanDto,
                                                   @RequestParam long exercisePlanId){


        return exercisePlanService.edit(exercisePlanDto,exercisePlanId);

    }

    @GetMapping("/get")
    public ResponseEntity<ExercisePlan> getExercisePlan(@RequestParam long exercisePlanId) {

        Optional<ExercisePlan> exercisePlan = exercisePlanService.getExercisePlan(exercisePlanId);

        return exercisePlan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteExercisePlan(@RequestParam long id) {

       if (exercisePlanService.delete(id)){

           return ResponseEntity.ok("Deleted exercise plan");
       }

       return ResponseEntity.notFound().build();

    }



}
