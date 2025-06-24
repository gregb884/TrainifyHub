package org.gregb884.trainingmanager.application.port.out;

public interface EmbeddingPort {

    String createEmbeddingForExercise(String exerciseName , long exerciseId);
    String getEmbeddingName(String exerciseName) throws Exception;

}
