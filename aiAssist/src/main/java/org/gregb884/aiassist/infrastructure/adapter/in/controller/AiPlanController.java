package org.gregb884.aiassist.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.dto.AiPlanDto;
import org.gregb884.aiassist.application.mapper.AiPlanDtoMapper;
import org.gregb884.aiassist.application.port.in.AiPlanUseCase;
import org.gregb884.aiassist.application.port.in.RequestUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/aiPlan")
public class AiPlanController {

    private final AiPlanUseCase aiPlanUseCase;
    private final RequestUseCase requestUseCase;
    private final AiPlanDtoMapper aiPlanDtoMapper;


    @GetMapping("/get")
    public ResponseEntity<AiPlanDto> getAiPlan(@RequestParam long id) {

        return aiPlanUseCase.getById(id)
                .map(aiPlanDtoMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());

    }

    @PostMapping("/createPlanFromAiPlan")
    public ResponseEntity<String> confirmCreatePlanFromAiPlan(@RequestParam long requestId) {

        try {

            Long planId = requestUseCase.createTrainingPlanFromPlanAi(requestId);

            return ResponseEntity.ok(planId.toString());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}