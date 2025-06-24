package org.gregb884.aiassist.infrastructure.adapter.out.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gregb884.aiassist.application.port.out.TranslatorPort;
import org.gregb884.aiassist.domain.model.AiPlan;
import org.gregb884.aiassist.domain.service.AiPlanJsonParser;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class OpenAiTranslatorAdapter implements TranslatorPort {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;


    @Override
    public AiPlan translateNameAndDescription(AiPlan aiPlan, String lang) throws IOException, InterruptedException {

            String name = "";
            String description = "";

            String prompt = "Translate this text to language " + lang + "\n" +
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

            String cleanJson = new AiPlanJsonParser().cleanJsonString(translatedJson);

            ObjectMapper objectMapper = new ObjectMapper();

            JsonNode rootNode = objectMapper.readTree(cleanJson);

            aiPlan.setPlanName(rootNode.get("name").asText());
            aiPlan.setDescription(rootNode.get("description").asText());

            return aiPlan;
    }
}
