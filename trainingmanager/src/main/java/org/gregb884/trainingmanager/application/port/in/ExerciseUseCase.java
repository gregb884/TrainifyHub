package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.ExerciseDto;
import org.gregb884.trainingmanager.application.dto.ExerciseDtoForCreate;
import org.gregb884.trainingmanager.application.dto.ExerciseDtoForEdit;
import org.gregb884.trainingmanager.application.dto.ExerciseDtoForNameList;
import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.domain.dto.ExerciseDtoForAi;
import org.gregb884.trainingmanager.domain.dto.ExerciseDtoOnlyEnName;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public interface ExerciseUseCase {


    Optional<Exercise> getExerciseById(long id);
    Map<Long,Exercise> exerciseMapWithIdForAiTrainingPlan(AiTrainingPlan aiTrainingPlan);
    void createNewExercise(ExerciseDtoForCreate exerciseDtoForCreate);
    Page<ExerciseDto> getAllExercisesPagePublicAndForUser(Pageable pageable , String search);
    List<ExerciseDtoForNameList> getExerciseNameList(List<Long> listId) throws Exception;
    boolean edit(long id, ExerciseDtoForEdit exerciseDtoForEdit);
    Set<String> getMainMusclesForDay(long dayId);
    boolean delete(long id);
    String addEmbeddingForAnyExercises();
    List<ExerciseDtoForAi> searchMostSimilarExercises(String inputText) throws Exception;
    List<ExerciseDtoOnlyEnName> exerciseDtoOnlyEnNames(String mainMuscle);


}
