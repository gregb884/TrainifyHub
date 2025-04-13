package org.gregb884.trainingmanager.controller;

import org.gregb884.trainingmanager.dto.*;
import org.gregb884.trainingmanager.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.model.TrainingPlan;
import org.gregb884.trainingmanager.service.NotificationService;
import org.gregb884.trainingmanager.service.TrainingPlanService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainingPlan")
public class TrainingPlanController {

    private final TrainingPlanService trainingPlanService;
    private final RestTemplate restTemplate;
    private final NotificationService notificationService;

    public TrainingPlanController(TrainingPlanService trainingPlanService, RestTemplate restTemplate, NotificationService notificationService) {
        this.trainingPlanService = trainingPlanService;
        this.restTemplate = restTemplate;
        this.notificationService = notificationService;
    }

    String userServiceUrl = "http://auth/api/users/exist?userName=";


    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody TrainingPlanDto trainingPlanDto) {

        return ResponseEntity.ok("Created a new training plan id: " +
                trainingPlanService.newPlanForYourself(trainingPlanDto));

    }

    @GetMapping("/viewTrainingPlan")
    public ResponseEntity<TrainingPlan> viewTrainingPlan(@RequestParam int id) throws Exception {

        TrainingPlan trainingPlan = trainingPlanService.getViewSingle(id);

        if (trainingPlan == null) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(trainingPlan);
    }

    @GetMapping("/oldTrainingPlanForAi")
    public ResponseEntity<TrainingPlanSummaryDto> trainingPlanForAi(@RequestParam int id) {

        TrainingPlanSummaryDto trainingPlan = trainingPlanService.toSummaryDto(trainingPlanService.getViewSingleForAi(id));

        if (trainingPlan == null) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(trainingPlan);
    }

    @GetMapping("/sumPlans")
    public ResponseEntity<String> sumPlans() {

        return trainingPlanService.sumPlans();
    }

    @GetMapping("/sumSchema")
    public ResponseEntity<String> sumSchema() {

        return trainingPlanService.sumSchema();
    }

    @GetMapping("/sumPlanToCheck")
    public ResponseEntity<String> sumPlanToCheck() {

        return trainingPlanService.sumPlanToCheck();
    }

    @PostMapping("/checked")
    public ResponseEntity<String> setPlanToChecked(@RequestParam long id){

        return trainingPlanService.setPlanToChecked(id);
    }

    @GetMapping("/myPlans")
    public ResponseEntity<String> myPlans() {

        return trainingPlanService.myPlans();
    }

    @GetMapping("/userInTrainingPlan")
    public ResponseEntity<Long> userInTrainingPlan(@RequestParam long id) {

        return trainingPlanService.userInTrainingPlan(id);

    }


    @GetMapping("/viewAllTrainingPlans")
    public ResponseEntity<List<TrainingPlan>> viewAllTrainingPlans() {

        List<TrainingPlan> trainingPlanList = trainingPlanService.getAllPlans();

        return ResponseEntity.ok(trainingPlanList);

    }

    @GetMapping("/getNextTraining")
    public ResponseEntity<TrainingPlanDtoWithDate> getNextTraining() {

        return trainingPlanService.getNearestDay();

    }

    @GetMapping("/simpleViewAllTrainingPlans")
    public ResponseEntity<List<TrainingPlanSimpleViewDto>> simpleViewAllTrainingPlans() {

        List<TrainingPlanSimpleViewDto> trainingPlanList = trainingPlanService.getAllPlansSimpleDto();

        return ResponseEntity.ok(trainingPlanList);

    }

    @PostMapping("/newPlanForUser")
    public ResponseEntity<String> createForUser(@RequestBody TrainingPlanDto trainingPlanDto,
                                                @RequestParam String email) {
        try {

            ResponseEntity<String> userExistResponse = restTemplate.getForEntity(userServiceUrl + email, String.class);

            if (userExistResponse.getStatusCode().is2xxSuccessful()) {

                Long newPlanId = trainingPlanService.newPlanForUser(email, trainingPlanDto);

                notificationService.newPlanCreated(email);

                return ResponseEntity.ok("Created a new training plan id: " + newPlanId);
            } else return ResponseEntity.badRequest().build();

        } catch (RestClientException e) {
            return ResponseEntity.status(400).body("User not exist or not access for user ");
        }
    }

    @GetMapping("/myTemplate")
    public ResponseEntity<List<TrainingPlanViewTemplateDto>> myTemplate() {

        return trainingPlanService.myTemplateView();
    }


    @PostMapping("/assignPlan")
    public ResponseEntity<String> assignPlanForUser(@RequestParam long planId,
                                                    @RequestParam String userEmail,
                                                    @RequestBody AssignPlanDto assignPlanDto) {


        try {

            ResponseEntity<String> userExistResponse = restTemplate.getForEntity(userServiceUrl + userEmail, String.class);

            if (userExistResponse.getStatusCode().is2xxSuccessful()) {

                try {

                    Long newPlanId = trainingPlanService.assignPlan(planId,userEmail,assignPlanDto);

                    notificationService.newPlanCreated(userEmail);

                    return ResponseEntity.ok("Created a new training plan id: " + newPlanId);

                } catch (Exception e) {

                  return ResponseEntity.status(400).body(e.getMessage());

                }


            } else return ResponseEntity.badRequest().build();

        } catch (RestClientException e) {
            return ResponseEntity.status(400).body("User not exist or not access for user ");
        }

}

    @PostMapping("/assignPlanFromWorkoutPlans")
    public ResponseEntity<String> assignPlanFromWorkoutPlans(@RequestParam long planId,
                                                    @RequestBody AssignPlanDto assignPlanDto) {

                try {

                    Long newPlanId = trainingPlanService.assignPlanFromWorkoutPlans(planId,assignPlanDto);


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

          Long createdAiTrainingPlanId = trainingPlanService.createAiPlan(aiTrainingPlanId,startDate,days);

          if (createdAiTrainingPlanId != null) {

              trainingPlanService.createNext3WeekForAiPlan(createdAiTrainingPlanId);

              return ResponseEntity.ok("" + createdAiTrainingPlanId);
          }


        }catch (Exception e){

            return ResponseEntity.status(400).body(e.getMessage());
        }

        return ResponseEntity.badRequest().build();

    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deletePlan(@RequestParam long id) {

        if (trainingPlanService.delete(id))
        {
            return ResponseEntity.ok("Deleted a training plan");
        }

        return ResponseEntity.badRequest().build();
    }


}
