package org.gregb884.trainingmanager.application.service;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.port.in.TrainingPlanUseCase;
import org.gregb884.trainingmanager.application.port.in.UserUseCase;
import org.gregb884.trainingmanager.application.port.in.WorkoutPlansUseCase;
import org.gregb884.trainingmanager.domain.model.WorkoutPlans;
import org.gregb884.trainingmanager.domain.repository.WorkoutPlansRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor
public class WorkoutPlansService implements WorkoutPlansUseCase {



    private final WorkoutPlansRepositoryPort workoutPlansRepository;
    private final AuthenticatedUser authenticatedUser;
    private final TrainingPlanUseCase trainingPlanUseCase;


    @Override
    public List<WorkoutPlans> getAllPlans() {

        return workoutPlansRepository.findAll();

    }

    @Override
    public void addNewPlan(WorkoutPlans workoutPlans) throws Exception {

        if (Objects.equals(authenticatedUser.getUserRole(), "ROLE_ADMIN")){

            try {

                workoutPlansRepository.save(workoutPlans);

            } catch (Exception e) {

                throw new Exception(e.getMessage());
            }

        }

        throw new Exception("Not allowed to add a new workout plan");

    }

    @Override
    public WorkoutPlans getPlan(long id) {

        Optional<WorkoutPlans> plan = workoutPlansRepository.findByPlanId(id);

        return plan.orElseThrow();

    }





}
