package org.gregb884.aiassist.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gregb884.aiassist.dto.ExerciseDtoForAi;
import org.gregb884.aiassist.model.*;
import org.gregb884.aiassist.model.AiExercise;
import org.gregb884.aiassist.repository.AiPlanRepository;
import org.gregb884.aiassist.repository.OptionalExerciseRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class AiPlanService {

    private static final String trainingManagerMatchUrl = "http://TRAININGMANAGER/api/exercise/findMatch" ;
    private static final String trainingManagerCreatePlan = "http://TRAININGMANAGER/api/trainingPlan/createAiPlan" ;

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    private final AiPlanRepository aiPlanRepository;
    private final UserService userService;
    private final RestTemplate restTemplate;
    private final OptionalExerciseRepository optionalExerciseRepository;
    private final RequestService requestService;

    public AiPlanService(AiPlanRepository aiPlanRepository, UserService userService, RestTemplate restTemplate, OptionalExerciseRepository optionalExerciseRepository, @Lazy RequestService requestService) {
        this.aiPlanRepository = aiPlanRepository;
        this.userService = userService;
        this.restTemplate = restTemplate;
        this.optionalExerciseRepository = optionalExerciseRepository;
        this.requestService = requestService;
    }


    public AiPlan parsePlanFromJsonAndSave(String jsonString) throws IOException, InterruptedException {
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
        aiPlan.setUserId(userService.getUserId());

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

                List<OptionalExercise> optionalExerciseList = getOptionalExercises(aiExercise.getExerciseName());

                for (OptionalExercise optionalExercise : optionalExerciseList) {

                    optionalExercise.setAiExercise(aiExercise);
                }

                aiExercise.setOptionalExerciseList(optionalExerciseList);

                aiExerciseList.add(aiExercise);
            }

            aiDay.setAiExercises(aiExerciseList);
            daysList.add(aiDay);
        }

        aiPlan.setAiDays(daysList);

        aiPlan = translateNameAndDescription(aiPlan);

        aiPlanRepository.save(aiPlan);

        return aiPlan;
    }

    public AiPlan translateNameAndDescription(AiPlan aiPlan) throws IOException, InterruptedException {

        if (!userService.getLang().equals("en")){

            String name = "";
            String description = "";

            String prompt = "Translate this text to language " + userService.getLang() + "\n" +
                    "name : " + aiPlan.getPlanName() +"\n" +
                    "description : " + aiPlan.getDescription() + "\n" +
                    "**Ensure the JSON is properly formatted and parsable. example answer in JSON format\n " +
                    "{\n" +
                    "  \"name\": \"Plan Name in correct language\",\n" +
                    "  \"description\": \"Description in correct language\",\n" +
                    "}"
                    ;

            JSONArray messages = new JSONArray();
            JSONObject userMessage = new JSONObject();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            messages.put(userMessage);

            JSONObject requestBody = new JSONObject();
            requestBody.put("model", "gpt-4");
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 500);
            requestBody.put("temperature", 0.4);

            HttpRequest requestToSend = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(requestToSend, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("OpenAI API error: " + response.body());
            }

            JSONObject responseBody = new JSONObject(response.body());
            String translatedJson = responseBody.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

            String cleanJson = cleanJsonString(translatedJson);

            ObjectMapper objectMapper = new ObjectMapper();

            JsonNode rootNode = objectMapper.readTree(cleanJson);

            aiPlan.setPlanName(rootNode.get("name").asText());
            aiPlan.setDescription(rootNode.get("description").asText());

            return aiPlan;
        }

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


    public List<OptionalExercise> getOptionalExercises(String exerciseName) {

        List<OptionalExercise> optionalExercises = new ArrayList<>();

        try {
            ResponseEntity<List<ExerciseDtoForAi>> response = restTemplate.exchange(
                    trainingManagerMatchUrl + "?exerciseName=" + exerciseName,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<ExerciseDtoForAi>>() {}
            );

            List<ExerciseDtoForAi> exercisesList = response.getBody();

            assert exercisesList != null;
            for (ExerciseDtoForAi exercise : exercisesList) {

                OptionalExercise optionalExercise = new OptionalExercise();
                optionalExercise.setExerciseId(exercise.getId());
                optionalExercise.setName(exercise.getName());
                optionalExercise.setNamePl(exercise.getNamePl());
                optionalExercise.setNameDe(exercise.getNameDe());
                optionalExercise.setImageUrl(exercise.getImageUrl());
                optionalExercises.add(optionalExercise);

            }

            optionalExercises.get(0).setSelected(true);

            return optionalExercises;

        } catch (Exception e) {

            e.printStackTrace();
        }

        return optionalExercises;

    }

    public ResponseEntity<AiPlan> getById(long id) {

        Optional<AiPlan> aiPlan = aiPlanRepository.findByIdAndUserId(userService.getUserId(), id);


        if (aiPlan.isPresent()) {


            return ResponseEntity.ok(aiPlan.get());
        }

        return ResponseEntity.notFound().build();


    }

    public ResponseEntity<String> createTrainingPlanFromPlanAi(long requestId) {

        Request request = requestService.getRequest(requestId).getBody();

        if (!(request == null)) {

            long aiPlanId = request.getAiPlanId();
            Date startDate = request.getStartDate();
            String days = request.getDays();


            try {

                ResponseEntity<String> response = restTemplate.exchange(
                        trainingManagerCreatePlan + "?aiTrainingPlanId=" + aiPlanId + "&startDate=" + startDate + "&days=" + days,
                        HttpMethod.POST,
                        null,
                        String.class
                );

                if (response.getStatusCode().is2xxSuccessful()){

                    request.setGeneratedPlanId(Long.parseLong(Objects.requireNonNull(response.getBody())));

                    requestService.save(request);

                    return ResponseEntity.ok(response.getBody());

                }


        } catch (Exception e){

                return ResponseEntity.badRequest().body(e.getMessage());

            }
        }


        return ResponseEntity.badRequest().build();

    }
}
