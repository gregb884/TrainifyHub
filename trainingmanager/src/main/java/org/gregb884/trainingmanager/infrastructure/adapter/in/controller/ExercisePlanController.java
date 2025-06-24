package org.gregb884.trainingmanager.infrastructure.adapter.in.controller;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.dto.ExercisePlanDto;
import org.gregb884.trainingmanager.application.port.in.ExercisePlanUseCase;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exercisePlan")
public class ExercisePlanController {


    private final ExercisePlanUseCase exercisePlanUseCase;


    @PostMapping("/create")
    @Transactional
    public ResponseEntity<String> createExercisePlan(@RequestBody ExercisePlanDto exercisePlanDto,
                                                     @RequestParam long dayId,
                                                     @RequestParam long exerciseId) {

       try {

           exercisePlanUseCase.create(dayId,exercisePlanDto,exerciseId);
           return ResponseEntity.ok("Exercise plan created");

       } catch (Exception e) {

           return ResponseEntity.badRequest().body(e.getMessage());
       }

    }

    @PostMapping("/edit")
    @Transactional
    public ResponseEntity<String> editExercisePlan(@RequestBody ExercisePlanDto exercisePlanDto,
                                                   @RequestParam long exercisePlanId){


        try {
            exercisePlanUseCase.edit(exercisePlanDto,exercisePlanId);
            return ResponseEntity.ok("Exercise plan updated");
        } catch (Exception e){

            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/get")
    public ResponseEntity<ExercisePlan> getExercisePlan(@RequestParam long exercisePlanId) {

        Optional<ExercisePlan> exercisePlan = exercisePlanUseCase.getExercisePlan(exercisePlanId);

        return exercisePlan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteExercisePlan(@RequestParam long id) {

       if (exercisePlanUseCase.delete(id)){

           return ResponseEntity.ok("Deleted exercise plan");
       }

       return ResponseEntity.notFound().build();

    }



}
