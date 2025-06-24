package org.gregb884.trainingmanager.infrastructure.adapter.in.controller;
import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.port.in.WorkoutPlansUseCase;
import org.gregb884.trainingmanager.domain.model.WorkoutPlans;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/workoutPlans")
public class WorkoutPlansController {

    private final WorkoutPlansUseCase workoutPlansUseCase;



    @GetMapping("/getAll")
    public ResponseEntity<List<WorkoutPlans>> getWorkoutPlans() {

        return ResponseEntity.ok(workoutPlansUseCase.getAllPlans());

    }

    @GetMapping("/getPlan")
    public ResponseEntity<WorkoutPlans> getWorkoutPlan(@RequestParam("id") long id) {


        try {
            WorkoutPlans plans = workoutPlansUseCase.getPlan(id);

            return ResponseEntity.ok(plans);
        } catch (Exception e){

            return ResponseEntity.notFound().build();
        }

    }


    @PostMapping("/add")
    public ResponseEntity<String> addWorkoutPlan(@RequestBody WorkoutPlans workoutPlans) {

        try {
            workoutPlansUseCase.addNewPlan(workoutPlans);
            return ResponseEntity.ok("Plan added successfully");
        } catch (Exception e){

            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }






}
