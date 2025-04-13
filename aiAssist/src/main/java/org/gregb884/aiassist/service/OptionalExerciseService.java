package org.gregb884.aiassist.service;

import org.gregb884.aiassist.model.AiExercise;
import org.gregb884.aiassist.model.OptionalExercise;
import org.gregb884.aiassist.repository.AiExerciseRepository;
import org.gregb884.aiassist.repository.OptionalExerciseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OptionalExerciseService {


    private final OptionalExerciseRepository optionalExerciseRepository;
    private final AiExerciseRepository aiExerciseRepository;
    private final UserService userService;


    public OptionalExerciseService(OptionalExerciseRepository optionalExerciseRepository, AiExerciseRepository aiExerciseRepository, UserService userService) {
        this.optionalExerciseRepository = optionalExerciseRepository;
        this.aiExerciseRepository = aiExerciseRepository;
        this.userService = userService;
    }


    public ResponseEntity<String> setChose(long aiExerciseId, long optionalExerciseId) {

        Optional<AiExercise> exerciseOpt = aiExerciseRepository.findByIdWithCheckUser(aiExerciseId, userService.getUserId());

        if (exerciseOpt.isPresent()) {
            AiExercise exercise = exerciseOpt.get();

            List<OptionalExercise> optionalExerciseList = exercise.getOptionalExerciseList();


            boolean found = false;
            for (OptionalExercise optionalExercise : optionalExerciseList) {
                if (optionalExercise.getId() == optionalExerciseId) {
                    optionalExercise.setSelected(true);
                    found = true;
                } else {
                    optionalExercise.setSelected(false);
                }
            }

            if (!found) {
                return ResponseEntity.notFound().build();
            }

            aiExerciseRepository.save(exercise);

            return ResponseEntity.ok("Optional exercise selected successfully.");
        } else {

            return ResponseEntity.notFound().build();
        }
    }

}
