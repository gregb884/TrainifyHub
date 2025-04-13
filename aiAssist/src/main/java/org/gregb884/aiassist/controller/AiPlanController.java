package org.gregb884.aiassist.controller;

import org.gregb884.aiassist.model.AiPlan;
import org.gregb884.aiassist.service.AiPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aiPlan")
public class AiPlanController {

    private final AiPlanService aiPlanService;

    public AiPlanController(AiPlanService aiPlanService) {
        this.aiPlanService = aiPlanService;
    }


    @GetMapping("/get")
    public ResponseEntity<AiPlan> getAiPlan(@RequestParam long id) {

        return aiPlanService.getById(id);

    }

    @PostMapping("/createPlanFromAiPlan")
    public ResponseEntity<String> confirmCreatePlanFromAiPlan(@RequestParam long requestId) {


        return aiPlanService.createTrainingPlanFromPlanAi(requestId);

    }


}
