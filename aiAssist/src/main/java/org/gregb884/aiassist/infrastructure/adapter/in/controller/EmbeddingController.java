package org.gregb884.aiassist.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.port.in.EmbeddingUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/embedding")
public class EmbeddingController {

    private final EmbeddingUseCase embeddingUseCase;


    @PostMapping("/create")
    public ResponseEntity<String> createEmbedding(@RequestParam String exerciseName) {

        try {
           String embedding = embeddingUseCase.generateEmbedding(exerciseName);
           return ResponseEntity.ok(embedding);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
