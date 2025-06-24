package org.gregb884.aiassist.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.port.in.OptionalExerciseFetcherUseCase;
import org.gregb884.aiassist.domain.model.AiExercise;
import org.gregb884.aiassist.domain.model.OptionalExercise;
import org.gregb884.aiassist.domain.repository.AiExerciseRepositoryPort;
import org.gregb884.aiassist.infrastructure.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OptionalExerciseService implements OptionalExerciseFetcherUseCase {


    private final AiExerciseRepositoryPort aiExerciseRepositoryPort;
    private final AuthenticatedUser authenticatedUser;


    @Override
    public Boolean setChose(long aiExerciseId, long optionalExerciseId) {

        Optional<AiExercise> exerciseOpt = aiExerciseRepositoryPort.findByIdWithCheckUser(aiExerciseId, authenticatedUser.getUserId());

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
                return false;
            }

            aiExerciseRepositoryPort.save(exercise);

            return true;
        } else {

            return false;
        }
    }

}
