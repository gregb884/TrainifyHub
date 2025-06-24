package org.gregb884.aiassist.application.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.dto.AiPlanDto;
import org.gregb884.aiassist.application.dto.RequestDto;
import org.gregb884.aiassist.application.mapper.AiPlanDtoMapper;
import org.gregb884.aiassist.application.port.in.AiPlanUseCase;
import org.gregb884.aiassist.application.port.out.*;
import org.gregb884.aiassist.domain.model.AiDay;
import org.gregb884.aiassist.domain.model.AiExercise;
import org.gregb884.aiassist.domain.model.AiPlan;
import org.gregb884.aiassist.domain.model.OptionalExercise;
import org.gregb884.aiassist.domain.repository.AiPlanRepositoryPort;
import org.gregb884.aiassist.domain.service.AiPlanJsonParser;
import org.gregb884.aiassist.domain.service.AiPromptBuilder;
import org.gregb884.aiassist.application.mapper.RequestMapperDto;
import org.gregb884.aiassist.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AiPlanService implements AiPlanUseCase {


    private final AuthenticatedUser authenticatedUser;
    private final OptionalExerciseFetcherPort optionalExerciseFetcherPort;
    private final TranslatorPort translatorPort;
    private final AiPlanGeneratorPort aiPlanGeneratorPort;
    private final ExerciseForMuscleFetcherPort exerciseForMuscleFetcherPort;
    private final RequestService requestService;
    private final CoinCheckerPort coinCheckerPort;
    private final AiPlanRepositoryPort aiPlanRepositoryPort;
    private final AiPromptBuilder promptBuilder = new AiPromptBuilder();
    private final RequestMapperDto requestMapperDto;
    private final NotificationPort notificationPort;
    private final AiPlanDtoMapper aiPlanDtoMapper;


    @Override
    public void createNewAiPlanFromRequest(long id) throws Exception {

        RequestDto request = requestService.getRequest(id);

        if(request == null){ return;}

        coinCheckerPort.userHasCoin();

        requestService.setRendering(id,true);

        AiPlan aiPlan = new AiPlan();

        try {

            String aiAnswer = aiPlanGeneratorPort.sendPrompt(
                    promptBuilder.buildPrompt(
                            requestMapperDto.toDomainRequest(request),
                            exerciseForMuscleFetcherPort.getExercisesForMuscle(
                                    request.getPrimaryFocus())));

            requestService.setAiAnswer(request.getId(), aiAnswer);

            aiPlan = createPlanFromJson(aiAnswer);

            validateAiPlan(aiPlan);

            requestService.setReadyAiPlan(request.getId(), aiPlan.getId());

            requestService.setRendering(id,false);

            notificationPort.newAiPlanCreated();

            coinCheckerPort.coinConsume();


        } catch (Exception e) {

            requestService.setRendering(id,false);
            deleteAiPlan(aiPlan);
            requestService.setReadyAiPlan(id, 0L);
            requestService.setAiAnswer(id,"");
            notificationPort.createPlanFail();
            System.out.println("Error creating new ai plan : " + e.getMessage());
            throw e;
        }

    }

    public void validateAiPlan(AiPlan aiPlan) throws Exception {
        if (aiPlan.getAiDays() == null || aiPlan.getAiDays().isEmpty()) {
            throw new Exception("Plan has no days.");
        }

        for (AiDay day : aiPlan.getAiDays()) {
            for (AiExercise exercise : day.getAiExercises()) {
                if (exercise.getOptionalExerciseList() == null || exercise.getOptionalExerciseList().isEmpty()) {
                    throw new Exception("Exercise " + exercise.getId() + " has no optional exercises.");
                }
            }
        }
    }


    public AiPlan createPlanFromJson(String json) throws Exception {

        json = new AiPlanJsonParser().cleanJsonString(json);

        Long userId = authenticatedUser.getUserId();
        List<String> exerciseNames = extractExerciseNamesFromJson(json);
        Map<String, List<OptionalExercise>> optionalMap = optionalExerciseFetcherPort.getForExercises(exerciseNames);

        AiPlan aiPlan = new AiPlanJsonParser().parsePlanFromJsonAndSave(json, userId, optionalMap);

        if (!authenticatedUser.getLang().equals("en")) {
            aiPlan = translatorPort.translateNameAndDescription(aiPlan, authenticatedUser.getLang());
        }

        aiPlan = aiPlanRepositoryPort.save(aiPlan);

        return aiPlan;
    }


    private List<String> extractExerciseNamesFromJson(String json) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode root = objectMapper.readTree(json);
        JsonNode daysNode = root.get("days");

        List<String> exerciseNames = new ArrayList<>();
        Iterator<String> dayNames = daysNode.fieldNames();
        while (dayNames.hasNext()) {
            JsonNode dayNode = daysNode.get(dayNames.next());
            Iterator<String> exercises = dayNode.fieldNames();
            while (exercises.hasNext()) {
                String name = exercises.next();
                if (!exerciseNames.contains(name)) {
                    exerciseNames.add(name);
                }
            }
        }
        return exerciseNames;
    }


    @Override
    public Optional<AiPlan> getById(long id) {
        Long userId = authenticatedUser.getUserId();
        return aiPlanRepositoryPort.findByIdAndUserId(userId, id);
    }

    private void deleteAiPlan(AiPlan aiPlan) {

        aiPlanRepositoryPort.delete(aiPlan);

    }


}
