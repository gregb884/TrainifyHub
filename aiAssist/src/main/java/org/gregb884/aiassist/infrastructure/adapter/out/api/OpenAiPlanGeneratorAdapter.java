package org.gregb884.aiassist.infrastructure.adapter.out.api;


import lombok.RequiredArgsConstructor;
import net.bytebuddy.implementation.bytecode.Throw;
import org.gregb884.aiassist.application.port.out.AiPlanGeneratorPort;
import org.gregb884.aiassist.domain.service.AiPlanJsonParser;
import org.gregb884.aiassist.domain.service.AiPromptBuilder;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenAiPlanGeneratorAdapter implements AiPlanGeneratorPort {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    private final AiPromptBuilder promptBuilder = new AiPromptBuilder();
    private final AiPlanJsonParser jsonParser = new AiPlanJsonParser();


    @Override
    public String sendPrompt(String prompt) throws Exception {

        try {

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

            String cleanedResponse = promptBuilder.extractJson(response.body());

            JSONObject responseBody = new JSONObject(cleanedResponse);
            String trainingPlan = responseBody.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

            return  jsonParser.cleanJsonString(trainingPlan.trim());

        } catch (Exception e){

            throw new Exception("OpenAI API error: " + e.getMessage());

        }
    }


}
