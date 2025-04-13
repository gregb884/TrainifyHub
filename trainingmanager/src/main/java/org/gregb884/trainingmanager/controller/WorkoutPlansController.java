package org.gregb884.trainingmanager.controller;

import org.gregb884.trainingmanager.model.WorkoutPlans;
import org.gregb884.trainingmanager.service.WorkoutPlansService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workoutPlans")
public class WorkoutPlansController {

    private final WorkoutPlansService workoutPlansService;

    public WorkoutPlansController(WorkoutPlansService workoutPlansService) {
        this.workoutPlansService = workoutPlansService;
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<WorkoutPlans>> getWorkoutPlans() {

        return workoutPlansService.getAllPlans();

    }

    @GetMapping("/getPlan")
    public ResponseEntity<WorkoutPlans> getWorkoutPlan(@RequestParam("id") long id) {

        return workoutPlansService.getPlan(id);

    }


    @PostMapping("/add")
    public ResponseEntity<String> addWorkoutPlan(@RequestBody WorkoutPlans workoutPlans) {

       return workoutPlansService.addNewPlan(workoutPlans);

    }






}
