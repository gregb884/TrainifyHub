package org.gregb884.aiassist.service;

import org.gregb884.aiassist.dto.ExerciseDtoOnlyEnName;
import org.gregb884.aiassist.dto.RequestDto;
import org.gregb884.aiassist.mapper.RequestMapper;
import org.gregb884.aiassist.model.AiPlan;
import org.gregb884.aiassist.model.Request;
import org.gregb884.aiassist.repository.AiPlanRepository;
import org.gregb884.aiassist.repository.RequestRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
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
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final UserService userService;
    private final RequestRepository requestRepository;
    private final RestTemplate restTemplate;
    private final AiPlanService aiPlanService;
    private final NotificationService notificationService;
    private final AiPlanRepository aiPlanRepository;


    public RequestService(UserService userService, RequestRepository requestRepository, RestTemplate restTemplate, AiPlanService aiPlanService, NotificationService notificationService, AiPlanRepository aiPlanRepository) {
        this.userService = userService;
        this.requestRepository = requestRepository;
        this.restTemplate = restTemplate;
        this.aiPlanService = aiPlanService;
        this.notificationService = notificationService;
        this.aiPlanRepository = aiPlanRepository;
    }

    private static final String getPlan_URL = "http://TRAININGMANAGER/api/trainingPlan/oldTrainingPlanForAi?id=" ;
    private static final String getFocusExercise_URL = "http://TRAININGMANAGER/api/exercise/getListForMuscleEn?mainMuscle=";
    private static final String checkAiCoins = "http://AUTH/api/users/checkAiCoins";
    private static final String consumeAiCoins = "http://AUTH/api/users/consumeAiCoin";
    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    public Request addRequestToRepository(Request request) {

        Request newRequest = new Request();

        newRequest.setGoal(request.getGoal());
        newRequest.setExperience(request.getExperience());
        newRequest.setEquipment(request.getEquipment());
        newRequest.setDays(request.getDays());
        newRequest.setPreferences(request.getPreferences());
        newRequest.setSessionTime(request.getSessionTime());
        newRequest.setLastPlanId(request.getLastPlanId());
        newRequest.setUserId(userService.getUserId());
        newRequest.setStartDate(request.getStartDate());
        newRequest.setPreviousOk(request.isPreviousOk());
        newRequest.setPrimaryFocus(request.getPrimaryFocus());
        requestRepository.save(newRequest);

        return newRequest;
    }





    public String fetchOldTrainingPlan(long id){

     return restTemplate.getForObject(getPlan_URL + id, String.class);


    }




    public ResponseEntity<Long> addNewAiRequest(Request request) throws Exception {

        ResponseEntity<String> response = restTemplate.exchange(
                checkAiCoins,
                HttpMethod.GET,
                null,
                String.class);

       if (!response.getStatusCode().is2xxSuccessful()){

           throw new Exception("Error while download coins " + response.getBody());
       }

       if ( Integer.parseInt(Objects.requireNonNull(response.getBody())) < 1 ){

           throw new Exception("No coins available " + response.getBody());
       }

       Request savedRequest = addRequestToRepository(request);


       if (!(savedRequest.getLastPlanId() == 0)){
           savedRequest.setLastPlanDescription(fetchOldTrainingPlan(savedRequest.getLastPlanId()));
           requestRepository.save(savedRequest);
       }

       return  ResponseEntity.ok(savedRequest.getId());
    }

    public ResponseEntity<Request> getRequest(long id) {

        Optional<Request> request = requestRepository.findById(id);

        if (request.isPresent() && request.get().getUserId() == userService.getUserId()){

            return ResponseEntity.ok(request.get());

        }

        return  ResponseEntity.notFound().build();

    }

    public int daysCount(String days) {

        String[] numbers = days.split(",");

        return numbers.length;
    }

    public String askToAi(Request request) throws Exception {

        String satisfied = "";

        if (request.getLastPlanId() != 0) {
            if (request.isPreviousOk()) {
                satisfied = "The user was satisfied with the previous plan.";
            } else {
                satisfied = "The user was not satisfied with the previous plan.";
            }
        }

        List<String> exerciseList = getExercisesForMuscle(request.getPrimaryFocus());

        String exercisesString = String.join(", ", exerciseList);

        String prompt = "You are a professional fitness coach. Please create a balanced, personalized training plan in JSON format based on the following user information:\n\n" +
                "**User Information:**\n" +
                "- **Goal**: " + request.getGoal() + "\n" +
                "- **Experience Level**: " + request.getExperience() + "\n" +
                "- **Training Days per Week**: " + daysCount(request.getDays()) + "\n" +
                "- **Session Duration**: " + request.getSessionTime() + " minutes\n" +
                "- **Excluded Equipment**: " + request.getEquipment() + "\n" +
                "- **Preferences**: " + request.getPreferences() + "\n" +
                "- **Previous Plan Satisfaction**: " + satisfied + "\n" +
                "- **Previous Plan Details**:\n" +
                request.getLastPlanDescription() + "\n" +
                "- **Do not schedule the same exercises as in the attached previous plan to ensure the plan feels fresh** \n"+
                "- **Primary Focus**: " + request.getPrimaryFocus() + "\n" +
                "- **Exercises for the primary focus only**: Please use exercises for " + request.getPrimaryFocus() + " from the following list: \n" +
                exercisesString + "\n" +
                "**Instructions:**\n" +
                "- Develop a training plan suitable for an " + request.getExperience() + " individual aiming for " + request.getGoal() + ".\n" +
                "- Schedule workouts for " + daysCount(request.getDays()) + " days per week, each lasting about " + request.getSessionTime() + " minutes.\n" +
                "- Include **6 to 8 exercises** per workout day, covering all major muscle groups to ensure balanced development.\n" +
                "- Use the provided list of exercises **only for the primary focus area (" + request.getPrimaryFocus() + ")** and add exercises for other muscle groups from your own knowledge base.\n" +
                "- Ensure exercises for " + request.getPrimaryFocus() + " meet the volume recommendations for the experience level: beginner (12 sets, 6 exercises), intermediate (15 sets, 7 exercises), advanced (20 sets, 8 exercises).\n" +
                "- Distribute the remaining volume across other major muscle groups (e.g., back, chest, arms, legs) using relevant exercises.\n" +
                "- Avoid including exercises that use " + request.getEquipment() + " or conflict with the user's preferences.\n" +
                "- Ensure the total weekly volume is appropriate for an " + request.getExperience() + " individual aiming for " + request.getGoal() + ".\n" +
                "- Provide detailed information for each workout day, including exercises, **plannedSeries** (number of sets), **repetitions**, and **rest periods**.\n" +
                "- Present the plan in JSON format ONLY, following this exact structure:\n" +
                "```json\n" +
                "{\n" +
                "  \"planName\": \"Plan Name in English\",\n" +
                "  \"description\": \"Brief description in English.\",\n" +
                "  \"days\": {\n" +
                "    \"day1\": {\n" +
                "      \"Barbell Squat\": { \"repetitions\": 8, \"plannedSeries\": 4, \"rest\": \"90 seconds\" },\n" +
                "      \"Lunges\": { \"repetitions\": 10, \"plannedSeries\": 3, \"rest\": \"60 seconds\" },\n" +
                "      ...\n" +
                "    },\n" +
                "    \"day2\": {\n" +
                "      \"Bench Press\": { \"repetitions\": 8, \"plannedSeries\": 4, \"rest\": \"90 seconds\" },\n" +
                "      \"Incline Dumbbell Press\": { \"repetitions\": 10, \"plannedSeries\": 3, \"rest\": \"60 seconds\" },\n" +
                "      ...\n" +
                "    },\n" +
                "    ...\n" +
                "  },\n" +
                "  \"additionalNotes\": \"Any additional notes in English.\"\n" +
                "}\n" +
                "```\n" +
                "- **Ensure the plan is balanced and does not focus exclusively on " + request.getPrimaryFocus() + ".**\n" +
                "- **Ensure the JSON is properly formatted and parsable. Do not include any text outside of the JSON structure.**";


        // Utwórz tablicę messages
        JSONArray messages = new JSONArray();
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.put(userMessage);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 2500);
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

        try {

            String cleanedResponse = extractJson(response.body());
            JSONObject responseBody = new JSONObject(cleanedResponse);
            String trainingPlan = responseBody.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

            return  aiPlanService.cleanJsonString(trainingPlan.trim());


        } catch (Exception e){

            throw new RuntimeException("OpenAI Wrong answer : " + response.body());
        }

    }

    public String extractJson(String response) {
        int start = response.indexOf("{");
        int end = response.lastIndexOf("}");
        if (start != -1 && end != -1) {
            return response.substring(start, end + 1);
        }
        throw new RuntimeException("Response does not contain valid JSON: " + response);
    }


    public List<String> getExercisesForMuscle(String mainMuscle) throws IOException, InterruptedException {
        String url = getFocusExercise_URL + mainMuscle;

        ResponseEntity<List<ExerciseDtoOnlyEnName>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ExerciseDtoOnlyEnName>>() {
                });

        List<ExerciseDtoOnlyEnName> exerciseDtos = response.getBody();

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to fetch exercises: " + response.getBody());
        }


        assert exerciseDtos != null;
        return exerciseDtos.stream().map(ExerciseDtoOnlyEnName::getName).collect(Collectors.toList());
    }



    public ResponseEntity<AiPlan> createAiPlan(long id) throws Exception {

        Optional<Request> request = requestRepository.findByIdAndUserId(id, userService.getUserId());

        try {
            ResponseEntity<String> responseAiCoinsCheck = restTemplate.exchange(
                    checkAiCoins,
                    HttpMethod.GET,
                    null,
                    String.class
            );

            if (!responseAiCoinsCheck.getStatusCode().is2xxSuccessful()) {

                throw new Exception("No AiCoinsCheck returned: " + responseAiCoinsCheck.getBody());
            }


            if (Integer.parseInt(Objects.requireNonNull(responseAiCoinsCheck.getBody())) < 1) {

                throw new Exception("No AiCoinsCheck returned: " + responseAiCoinsCheck.getBody());
            }

        } catch (Exception e) {

            throw new Exception("No AiCoinsCheck");

        }

        request.get().setIsRendering(true);

        requestRepository.save(request.get());


        if (request.isPresent()){

            try {

                String aiAnswer =  askToAi(request.get());

                request.get().setAiAnswer(aiAnswer);


                AiPlan aiPlan = aiPlanService.parsePlanFromJsonAndSave(aiAnswer);

                request.get().setAiPlanId(aiPlan.getId());

                request.get().setIsRendering(false);

                requestRepository.save(request.get());

                ResponseEntity<String> response = restTemplate.exchange(
                        consumeAiCoins,
                        HttpMethod.POST,
                        null,
                        String.class);

                if (!response.getStatusCode().is2xxSuccessful()) {

                    requestRepository.delete(request.get());
                    aiPlanRepository.delete(aiPlan);


                    throw new RuntimeException("Failed consume Coin : " + response.getBody());
                }

                notificationService.newAiPlanCreated();



                return ResponseEntity.ok(aiPlan);

            } catch (Exception e) {

                request.get().setIsRendering(false);


                notificationService.createPlanFail();
                requestRepository.save(request.get());

                throw new Exception(e.getMessage());
            }



        }

        return ResponseEntity.notFound().build();


    }





    public ResponseEntity<Boolean> isRequestRendering(long id) {

        Optional<Request> request = requestRepository.findByIdAndUserId(id, userService.getUserId());

        if (request.isPresent()) {

           return ResponseEntity.ok(request.get().getIsRendering());

        }


        return ResponseEntity.notFound().build();
    }

    public void save(Request request) {

        if (request.getUserId() == userService.getUserId()) {

            requestRepository.save(request);

        }

    }

    public ResponseEntity<String> countRequestWithoutPlanQuantity() {

       int quantity = requestRepository.countByUserIdRequestWithAction(userService.getUserId());

       return ResponseEntity.ok(Integer.toString(quantity));

    }

    public ResponseEntity<List<RequestDto>> requestAiToAssignList() {

        Optional<List<Request>> requestList = requestRepository.ListUserIdToAssign(userService.getUserId());

        if (requestList.isPresent()) {

          List<RequestDto> requestDtos = requestList.get().stream().map(RequestMapper::toDto).toList();


          return ResponseEntity.ok(requestDtos);

        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> countRequestToAssign() {


        int quantity = requestRepository.countByUserIdToAssign(userService.getUserId());

        return ResponseEntity.ok(Integer.toString(quantity));

    }

    public ResponseEntity<List<RequestDto>> requestAiWithoutPlanList() {

        Optional<List<Request>> requestList = requestRepository.ListUserIdWithoutPlan(userService.getUserId());

        if (requestList.isPresent()) {

            List<RequestDto> requestDtos = requestList.get().stream().map(RequestMapper::toDto).toList();


            return ResponseEntity.ok(requestDtos);

        }
        return ResponseEntity.notFound().build();


    }

    public ResponseEntity<String> setNewStartDate(long id, Date startDate) {


        Optional<Request> request = requestRepository.findByIdAndUserId(id, userService.getUserId());

        if (request.isPresent()) {

            request.get().setStartDate(startDate);

            requestRepository.save(request.get());

            return ResponseEntity.ok("Date Changed");
        }

        return ResponseEntity.notFound().build();
    }
}
