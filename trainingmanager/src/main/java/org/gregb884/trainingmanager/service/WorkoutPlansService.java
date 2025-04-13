package org.gregb884.trainingmanager.service;

import org.gregb884.trainingmanager.model.TrainingPlan;
import org.gregb884.trainingmanager.model.WorkoutPlans;
import org.gregb884.trainingmanager.repository.TrainingPlanRepository;
import org.gregb884.trainingmanager.repository.WorkoutPlansRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class WorkoutPlansService {

    private final WorkoutPlansRepository workoutPlansRepository;
    private final UserService userService;
    private final TrainingPlanRepository trainingPlanRepository;

    public WorkoutPlansService(WorkoutPlansRepository workoutPlansRepository, UserService userService, TrainingPlanRepository trainingPlanRepository) {
        this.workoutPlansRepository = workoutPlansRepository;
        this.userService = userService;
        this.trainingPlanRepository = trainingPlanRepository;
    }


    public ResponseEntity<List<WorkoutPlans>> getAllPlans() {

        return ResponseEntity.ok(workoutPlansRepository.findAll());

    }

    public ResponseEntity<String> addNewPlan(WorkoutPlans workoutPlans) {

        if (Objects.equals(userService.getUserRole(), "ROLE_ADMIN")){

            try {

                workoutPlansRepository.save(workoutPlans);

                return ResponseEntity.ok("Plan added successfully");
            } catch (Exception e) {

               return ResponseEntity.badRequest().body(e.getMessage());
            }

        }

        return ResponseEntity.badRequest().body("Error while adding new plan");

    }

    public ResponseEntity<WorkoutPlans> getPlan(long id) {

        Optional<WorkoutPlans> plan = workoutPlansRepository.findByPlanId(id);

        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());


    }
}
