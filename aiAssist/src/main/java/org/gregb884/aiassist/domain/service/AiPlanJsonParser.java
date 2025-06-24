package org.gregb884.aiassist.domain.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gregb884.aiassist.domain.model.AiDay;
import org.gregb884.aiassist.domain.model.AiExercise;
import org.gregb884.aiassist.domain.model.AiPlan;
import org.gregb884.aiassist.domain.model.OptionalExercise;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class AiPlanJsonParser {

    public AiPlan parsePlanFromJsonAndSave(String jsonString, Long userId, Map<String, List<OptionalExercise>> optionalMap) throws IOException, InterruptedException {
        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode rootNode;
        try {
            rootNode = objectMapper.readTree(jsonString);
        } catch (IOException e) {
            throw new RuntimeException("Invalid JSON format", e);
        }

        AiPlan aiPlan = new AiPlan();
        aiPlan.setPlanName(rootNode.get("planName").asText());
        aiPlan.setDescription(rootNode.get("description").asText());
        aiPlan.setAdditionalNotes(rootNode.get("additionalNotes").asText());
        aiPlan.setUserId(userId);

        List<AiDay> daysList = new ArrayList<>();

        JsonNode daysNode = rootNode.get("days");
        Iterator<String> dayNames = daysNode.fieldNames();

        while (dayNames.hasNext()) {
            String dayName = dayNames.next();
            JsonNode dayNode = daysNode.get(dayName);

            AiDay aiDay = new AiDay();
            aiDay.setDayName(dayName);
            aiDay.setAiPlan(aiPlan);

            List<AiExercise> aiExerciseList = new ArrayList<>();

            Iterator<String> exerciseNames = dayNode.fieldNames();

            while (exerciseNames.hasNext()) {
                String exerciseName = exerciseNames.next();
                JsonNode exerciseNode = dayNode.get(exerciseName);

                AiExercise aiExercise = new AiExercise();
                aiExercise.setExerciseName(exerciseName);
                aiExercise.setRepetitions(exerciseNode.get("repetitions").asInt());
                if (exerciseNode.get("repetitions").asInt() == 0) {
                    aiExercise.setRepetitions(15);
                }
                aiExercise.setPlannedSeries(exerciseNode.get("plannedSeries").asInt());
                String restString = exerciseNode.get("rest").asText();
                String numberOnly = restString.replaceAll("[^0-9]", "");
                if (!numberOnly.isEmpty()) {
                    int restValue = Integer.parseInt(numberOnly);
                    aiExercise.setRest(restValue);
                } else {

                    aiExercise.setRest(90);
                }
                aiExercise.setAiDay(aiDay);


                List<OptionalExercise> optionalList = optionalMap.getOrDefault(exerciseName, List.of());
                for (OptionalExercise opt : optionalList) {
                    opt.setAiExercise(aiExercise);
                }

                aiExercise.setOptionalExerciseList(optionalList);
                aiExerciseList.add(aiExercise);
            }

            aiDay.setAiExercises(aiExerciseList);
            daysList.add(aiDay);
        }

        aiPlan.setAiDays(daysList);

        return aiPlan;
    }



    public String cleanJsonString(String jsonString) {
        jsonString = jsonString.trim();
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.substring(7); // Remove ```json
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.substring(3); // Remove ```
        }
        if (jsonString.endsWith("```")) {
            jsonString = jsonString.substring(0, jsonString.length() - 3); // Remove ```
        }
        return jsonString.trim();
    }






}
