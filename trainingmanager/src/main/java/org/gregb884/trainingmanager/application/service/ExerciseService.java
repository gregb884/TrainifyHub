package org.gregb884.trainingmanager.application.service;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.ExerciseDto;
import org.gregb884.trainingmanager.application.dto.ExerciseDtoForCreate;
import org.gregb884.trainingmanager.application.dto.ExerciseDtoForEdit;
import org.gregb884.trainingmanager.application.dto.ExerciseDtoForNameList;
import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.application.mapper.ExerciseDtoForCreateMapper;
import org.gregb884.trainingmanager.application.mapper.ExerciseDtoForNameListMapper;
import org.gregb884.trainingmanager.application.mapper.ExerciseDtoMapper;
import org.gregb884.trainingmanager.application.port.in.DayUseCase;
import org.gregb884.trainingmanager.application.port.in.ExerciseUseCase;
import org.gregb884.trainingmanager.application.port.out.EmbeddingPort;
import org.gregb884.trainingmanager.domain.dto.ExerciseDtoForAi;
import org.gregb884.trainingmanager.domain.dto.ExerciseDtoOnlyEnName;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.domain.repository.ExerciseRepositoryPort;
import org.gregb884.trainingmanager.domain.service.SimilarExerciseService;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ExerciseService implements ExerciseUseCase {

    private final ExerciseRepositoryPort exerciseRepository;
    private final AuthenticatedUser authenticatedUser;
    private final ExerciseDtoForCreateMapper exerciseDtoForCreateMapper;
    private final ExerciseDtoMapper exerciseDtoMapper;
    private final DayUseCase dayUseCase;
    private final ExerciseDtoForNameListMapper exerciseDtoForNameListMapper;
    private final EmbeddingPort embeddingPort;
    private final SimilarExerciseService similarExerciseService = new SimilarExerciseService();


    @Override
    public Optional<Exercise> getExerciseById(long id) {

        return exerciseRepository.findByIdAndIsPrivateFalseOrCreatorId(id, authenticatedUser.getUserId());
    }

    @Override
    public void createNewExercise(ExerciseDtoForCreate exerciseDtoForCreate){

        Exercise exercise = exerciseDtoForCreateMapper.toDomain(exerciseDtoForCreate);

        exerciseRepository.save(exercise);

    }

    @Override
    public Page<ExerciseDto> getAllExercisesPagePublicAndForUser(Pageable pageable ,String search) {

        String searchToLowerCase = search.toLowerCase();

        String lang = authenticatedUser.getLang();

        switch (lang) {
            case "en" -> {

                Page<Exercise> exercises = exerciseRepository.findByIsPrivateFalseOrCreatorId(authenticatedUser.getUserId(),searchToLowerCase,pageable);

                return exercises.map(exerciseDtoMapper::toDto);
            }
            case "pl" -> {

                Page<Exercise> exercises = exerciseRepository.findByIsPrivateFalseOrCreatorIdPl(authenticatedUser.getUserId(),searchToLowerCase,pageable);

                return exercises.map(exerciseDtoMapper::toDto);
            }
            case "de" -> {

                Page<Exercise> exercises = exerciseRepository.findByIsPrivateFalseOrCreatorIdDe(authenticatedUser.getUserId(),searchToLowerCase,pageable);

                return exercises.map(exerciseDtoMapper::toDto);
            }
        }

        return null;

    }

    @Override
    public boolean edit(long id, ExerciseDtoForEdit exerciseDtoForEdit) {

        Optional<Exercise> exerciseToEdit = exerciseRepository.findByIdAccessOnlyCreatorId(id, authenticatedUser.getUserId());

        if (exerciseToEdit.isPresent()) {

            exerciseToEdit.get().setName(exerciseDtoForEdit.getName());
            exerciseToEdit.get().setNamePl(exerciseDtoForEdit.getNamePl());
            exerciseToEdit.get().setNameDe(exerciseDtoForEdit.getNameDe());
            exerciseToEdit.get().setDescription(exerciseDtoForEdit.getDescription());
            exerciseToEdit.get().setDescriptionPl(exerciseDtoForEdit.getDescriptionPl());
            exerciseToEdit.get().setDescriptionDe(exerciseDtoForEdit.getDescriptionDe());
            exerciseToEdit.get().setAdditionalInfo(exerciseDtoForEdit.getAdditionalInfo());
            exerciseToEdit.get().setIsPrivate(exerciseDtoForEdit.getIsPrivate());
            exerciseToEdit.get().setImageUrl(exerciseDtoForEdit.getImageUrl());
            exerciseToEdit.get().setVideoUrl(exerciseDtoForEdit.getVideoUrl());
            exerciseToEdit.get().setVideoUrlPl(exerciseDtoForEdit.getVideoUrlPl());
            exerciseToEdit.get().setVideoUrlDe(exerciseDtoForEdit.getVideoUrlDe());

            exerciseRepository.save(exerciseToEdit.get());

            return true;
        }

        return false;

    }

    @Override
    public Set<String> getMainMusclesForDay(long dayId) {


        Optional<Day> day = dayUseCase.getDay(dayId);

        if(day.isEmpty()){
            return new HashSet<>();
        }
        return day.stream()
                .flatMap(day1 -> day1.getExercisePlans().stream())
                .map(exercisePlan -> exercisePlan.getExercise().getMainMuscle())
                .collect(Collectors.toSet());
    }

    @Override
    public boolean delete(long id) {

        Optional<Exercise> exercise = exerciseRepository.findByIdAccessOnlyCreatorId(id, authenticatedUser.getUserId());

        if (exercise.isPresent()) {

            exerciseRepository.delete(exercise.get());
            return true;
        }
        return false;
    }

    @Override
    public List<ExerciseDtoForNameList> getExerciseNameList(List<Long> listId) throws Exception {


        Optional<List<Exercise>> exerciseList = exerciseRepository.findByIdListAndIsPrivateFalseOrCreatorId(listId, authenticatedUser.getUserId());


        if (exerciseList.isPresent()) {

            List<ExerciseDtoForNameList> exerciseDtoForNameLists = new ArrayList<>();

            for (Exercise exercise : exerciseList.get()) {

                exerciseDtoForNameLists.add(exerciseDtoForNameListMapper.toDto(exercise));
            }

            return exerciseDtoForNameLists;

        }

        throw new Exception("Exercise not found");
    }

    public List<Exercise> findAll() {

        return exerciseRepository.findAll();
    }

    @Override
    public List<ExerciseDtoOnlyEnName> exerciseDtoOnlyEnNames(String mainMuscle){

        List<String> mainMuscleList = Arrays.stream(mainMuscle.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toList());


        if (mainMuscle.equals("legs")){

            mainMuscleList.clear();

            mainMuscleList.add("hamstrings");
            mainMuscleList.add("quads");

        }

        if (mainMuscle.equals("arms")){

            mainMuscleList.clear();

            mainMuscleList.add("forearms");
            mainMuscleList.add("triceps");

        }

        return exerciseRepository.findByMainMuscleInAndIsPrivateFalseOrCreatorId(mainMuscleList, authenticatedUser.getUserId());

    }


    @Override
    public String addEmbeddingForAnyExercises(){


        List<Exercise> allExercises = findAll();

        int successCount = 0;
        int failCount = 0;

        for (Exercise exercise : allExercises) {

            if (exercise.getEmbedding() == null || exercise.getEmbedding().isEmpty()) {

                String embedding = embeddingPort.createEmbeddingForExercise(exercise.getName(),exercise.getId());

                if (embedding != null && !embedding.isEmpty()) {

                    exercise.setEmbedding(embedding);
                    exerciseRepository.save(exercise);
                    successCount++;
                } else failCount++;

            }

        }

        return "Successfully updated " + successCount + " exercises. "
                + failCount + " failed.";

    }


    @Override
    public List<ExerciseDtoForAi> searchMostSimilarExercises(String inputText) throws Exception{

            String inputEmbeddingJson = embeddingPort.getEmbeddingName(inputText);

            List<Exercise> allExercises = exerciseRepository.findAll();

            if (allExercises.isEmpty()) {throw new Exception("Empty Exercise List");}

            return similarExerciseService.findMostSimilarExercises(inputEmbeddingJson,allExercises);

    }


    @Override
    public Map<Long,Exercise> exerciseMapWithIdForAiTrainingPlan(AiTrainingPlan aiTrainingPlan){

        Map<Long, Exercise> exerciseMap = new HashMap<>();

        for (AiTrainingPlan.Day aiDay : aiTrainingPlan.getAiDays()) {
            for (AiTrainingPlan.Exercise aiExercise : aiDay.getAiExercises()) {
                aiExercise.getOptionalExerciseList().stream()
                        .filter(AiTrainingPlan.OptionalExercise::isSelected)
                        .map(AiTrainingPlan.OptionalExercise::getExerciseId)
                        .distinct()
                        .forEach(id -> {
                            if (!exerciseMap.containsKey(id)) {
                                Exercise exercise = getExerciseById(id).orElseThrow(() ->
                                        new IllegalArgumentException("Exercise not found for ID: " + id));
                                exerciseMap.put(id, exercise);
                            }
                        });
            }
        }

        return exerciseMap;
    }

}
