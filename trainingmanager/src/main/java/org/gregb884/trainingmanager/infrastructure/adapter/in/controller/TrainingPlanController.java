package org.gregb884.trainingmanager.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.dto.AssignPlanDto;
import org.gregb884.trainingmanager.application.dto.TrainingPlanDto;
import org.gregb884.trainingmanager.application.dto.TrainingPlanSimpleViewDto;
import org.gregb884.trainingmanager.application.port.in.AiPlanCreatorUseCase;
import org.gregb884.trainingmanager.application.port.in.AssignTrainingPlanUseCase;
import org.gregb884.trainingmanager.application.port.in.TrainingPlanUseCase;
import org.gregb884.trainingmanager.application.port.out.UserExistCheckPort;
import org.gregb884.trainingmanager.application.service.TrainingPlanService;
import org.gregb884.trainingmanager.domain.model.TrainingPlan;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trainingPlan")
public class TrainingPlanController {





    private final UserExistCheckPort userExistCheckPort;
    private final TrainingPlanUseCase trainingPlanUseCase;
    private final AssignTrainingPlanUseCase assignTrainingPlanUseCase;
    private final AuthenticatedUser authenticatedUser;
    private final AiPlanCreatorUseCase aiPlanCreatorUseCase;

    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody TrainingPlanDto trainingPlanDto) {

        return ResponseEntity.ok("Created a new training plan id: " +
                trainingPlanUseCase.newPlanForYourself(trainingPlanDto));

    }

    @GetMapping("/viewTrainingPlan")
    public ResponseEntity<Object> viewTrainingPlan(@RequestParam int id) {

        try {

            TrainingPlan trainingPlan = trainingPlanUseCase.getViewSingle(id);

            if (trainingPlan == null) {

                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(trainingPlan);

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/oldTrainingPlanForAi")
    public ResponseEntity<Object> trainingPlanForAi(@RequestParam int id) {

       try {
           return ResponseEntity.ok(trainingPlanUseCase.getTrainingPlanSummary(id));
       } catch (Exception e){
           return ResponseEntity.badRequest().body(e.getMessage());
       }
    }

    @GetMapping("/sumPlans")
    public ResponseEntity<Long> sumPlans() {

        return ResponseEntity.ok(trainingPlanUseCase.sumPlans());
    }

    @GetMapping("/sumSchema")
    public ResponseEntity<String> sumSchema() {


        try {
            return ResponseEntity.ok(trainingPlanUseCase.sumSchema().toString());
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/sumPlanToCheck")
    public ResponseEntity<Long> sumPlanToCheck() {

        return ResponseEntity.ok(trainingPlanUseCase.sumPlanToCheck());
    }

    @PostMapping("/checked")
    public ResponseEntity<String> setPlanToChecked(@RequestParam long id){

        try {
            trainingPlanUseCase.setPlanToChecked(id);
            return ResponseEntity.ok("Success");
        } catch (Exception e){

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/myPlans")
    public ResponseEntity<Long> myPlans() {

        return ResponseEntity.ok(trainingPlanUseCase.myPlans());
    }

    @GetMapping("/userInTrainingPlan")
    public ResponseEntity<Long> userInTrainingPlan(@RequestParam long id) {

        long count = trainingPlanUseCase.userInTrainingPlan(id).orElse(0L);

        return ResponseEntity.ok(count);

    }


    @GetMapping("/viewAllTrainingPlans")
    public ResponseEntity<List<TrainingPlan>> viewAllTrainingPlans() {

        List<TrainingPlan> trainingPlanList = trainingPlanUseCase.getAllPlans();
        return ResponseEntity.ok(trainingPlanList);

    }

    @GetMapping("/getNextTraining")
    public ResponseEntity<Object> getNextTraining() {

        try {
            return ResponseEntity.ok(trainingPlanUseCase.getNearestDay());
        } catch (Exception e){

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/simpleViewAllTrainingPlans")
    public ResponseEntity<List<TrainingPlanSimpleViewDto>> simpleViewAllTrainingPlans() {

        List<TrainingPlanSimpleViewDto> trainingPlanList = trainingPlanUseCase.getAllPlansSimpleDto();

        return ResponseEntity.ok(trainingPlanList);

    }

    @PostMapping("/newPlanForUser")
    public ResponseEntity<String> createForUser(@RequestBody TrainingPlanDto trainingPlanDto,
                                                @RequestParam String email) {


        if (!userExistCheckPort.userExistsInAuthModule(email))
        {return ResponseEntity.status(400).body("User not exist or not access for user");}

        long newPlanId = trainingPlanUseCase.newPlanForUser(email, trainingPlanDto);

        if (newPlanId == 0L){return ResponseEntity.status(400).body("Error while creating new plan");}

        return ResponseEntity.ok("Created a new training plan id: " + newPlanId);

    }

    @GetMapping("/myTemplate")
    public ResponseEntity<Object> myTemplate() {

        try {
            return ResponseEntity.ok(trainingPlanUseCase.myTemplateView());
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }


    @PostMapping("/assignPlan")
    public ResponseEntity<String> assignPlanForUser(@RequestParam long planId,
                                                    @RequestParam String userEmail,
                                                    @RequestBody AssignPlanDto assignPlanDto) {

        try {

        Long newPlanId = assignTrainingPlanUseCase.assignPlan(planId, userEmail, assignPlanDto,false);

        return ResponseEntity.ok("Created a new training plan id: " + newPlanId);


        } catch (Exception e){return ResponseEntity.badRequest().body(e.getMessage());}


}

    @PostMapping("/assignPlanFromWorkoutPlans")
    public ResponseEntity<String> assignPlanFromWorkoutPlans(@RequestParam long planId,
                                                    @RequestBody AssignPlanDto assignPlanDto) {

                try {

                    Long newPlanId = assignTrainingPlanUseCase.assignPlan(planId,authenticatedUser.getEmail(),assignPlanDto,true);

                    return ResponseEntity.ok("" + newPlanId);

                } catch (Exception e) {

                    return ResponseEntity.status(400).body(e.getMessage());
                }
    }


    @PostMapping("/createAiPlan")
    public ResponseEntity<String> createAiPlan(@RequestParam Long aiTrainingPlanId,
                                               @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startDate,
                                               @RequestParam String days){

        try {

          Long createdAiTrainingPlanId = aiPlanCreatorUseCase.createAiPlan(aiTrainingPlanId,startDate,days);

          if (createdAiTrainingPlanId != null) {
              return ResponseEntity.ok("" + createdAiTrainingPlanId);
          } else throw new Exception("CreatedAiPlanId is null");

        }catch (Exception e){
            return ResponseEntity.status(400).body(e.getMessage());
        }


    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deletePlan(@RequestParam long id) {

        if (trainingPlanUseCase.delete(id))
        {
            return ResponseEntity.ok("Deleted a training plan");
        }

        return ResponseEntity.badRequest().build();
    }


}
