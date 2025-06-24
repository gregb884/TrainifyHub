package org.gregb884.trainingmanager.domain.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gregb884.trainingmanager.domain.dto.ExerciseDtoForAi;
import org.gregb884.trainingmanager.domain.dto.ExerciseSimilarity;
import org.gregb884.trainingmanager.domain.model.Exercise;

import java.util.ArrayList;
import java.util.List;

public class SimilarExerciseService {


    public double cosineSimilarity(List<Double> vectorA, List<Double> vectorB) {
        if (vectorA.size() != vectorB.size()) {
            throw new IllegalArgumentException("Vectors must be of the same length");
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.size(); i++) {
            dotProduct += vectorA.get(i) * vectorB.get(i);
            normA += Math.pow(vectorA.get(i), 2);
            normB += Math.pow(vectorB.get(i), 2);
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }


    private List<Double> convertJsonToVector(String json) {

        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, new TypeReference<List<Double>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to vector: " + e.getMessage());
        }
    }

    public List<ExerciseDtoForAi> findMostSimilarExercises(String inputEmbeddingJson , List<Exercise> allExercises ) {

        List<Double> inputEmbedding = convertJsonToVector(inputEmbeddingJson);

        // Create a list to store exercises along with their similarity scores
        List<ExerciseSimilarity> exerciseSimilarities = new ArrayList<>();

        for (Exercise exercise : allExercises) {
            // Convert the stored embedding JSON string to a vector
            List<Double> exerciseEmbedding = convertJsonToVector(exercise.getEmbedding());

            // Calculate cosine similarity
            double similarity = cosineSimilarity(inputEmbedding, exerciseEmbedding);

            // Add the exercise and its similarity score to the list
            exerciseSimilarities.add(new ExerciseSimilarity(new ExerciseDtoForAi(exercise.getId(),exercise.getName(),exercise.getNamePl(),exercise.getNameDe(),exercise.getImageUrl()), similarity));
        }

        // Sort the exercises by similarity score in descending order
        exerciseSimilarities.sort((es1, es2) -> Double.compare(es2.getSimilarity(), es1.getSimilarity()));

        // Prepare a list to hold the top 3 exercises
        List<ExerciseDtoForAi> topExercises = new ArrayList<>();

        // Get the top 3 most similar exercises
        for (int i = 0; i < Math.min(3, exerciseSimilarities.size()); i++) {
            topExercises.add(exerciseSimilarities.get(i).getExercise());
        }

        return topExercises;
    }




}
