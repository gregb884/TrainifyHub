package org.gregb884.aiassist.service;

import org.apache.hc.core5.http.ContentType;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmbeddingService {


    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    private static final String OPENAI_EMBEDDING_URL = "https://api.openai.com/v1/embeddings";


    public String generateEmbedding(String inputText) throws Exception {

        JSONObject requestBody = new JSONObject();
        requestBody.put("input", inputText);
        requestBody.put("model", "text-embedding-ada-002");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(OPENAI_EMBEDDING_URL))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("OpenAI API error: " + response.body());
        }

        return extractEmbedding(response.body());

    }

    public String extractEmbedding(String response) {
        JSONObject jsonResponse = new JSONObject(response);
        JSONArray dataArray = jsonResponse.getJSONArray("data");
        JSONArray embeddingArray = dataArray.getJSONObject(0).getJSONArray("embedding");

        return embeddingArray.toString();
    }


}
