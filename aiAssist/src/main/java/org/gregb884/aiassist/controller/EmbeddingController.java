package org.gregb884.aiassist.controller;

import org.gregb884.aiassist.service.EmbeddingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/embedding")
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    public EmbeddingController(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }


    @PostMapping("/create")
    public ResponseEntity<String> createEmbedding(@RequestParam String exerciseName) {

        try {

            return ResponseEntity.ok(embeddingService.generateEmbedding(exerciseName));


        } catch (Exception e) {
            throw new RuntimeException(e);
        }


    }




}
