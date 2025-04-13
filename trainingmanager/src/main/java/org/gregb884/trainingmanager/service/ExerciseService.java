package org.gregb884.trainingmanager.service;

import org.gregb884.trainingmanager.dto.*;
import org.gregb884.trainingmanager.mapper.ExerciseMapper;
import org.gregb884.trainingmanager.model.Day;
import org.gregb884.trainingmanager.model.Exercise;
import org.gregb884.trainingmanager.repository.ExerciseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExerciseService {


    private static final String EMBEDDING_URL = "http://AIASSIST/api/embedding/create" ;
    private final ExerciseRepository repository;
    private final UserService userService;
    private final DayService dayService;
    private final RestTemplate restTemplate;


    public ExerciseService(ExerciseRepository repository, UserService userService, DayService dayService, RestTemplate restTemplate) {
        this.repository = repository;
        this.userService = userService;
        this.dayService = dayService;
        this.restTemplate = restTemplate;
    }


    public void createNewExercise(ExerciseDtoForCreate exerciseDtoForCreate) {

        Exercise exercise = new Exercise();

        if (userService.getLang().equals("pl")){

            exercise.setNamePl(exerciseDtoForCreate.getName());
            exercise.setDescriptionPl(exerciseDtoForCreate.getDescription());
            exercise.setImageUrl(exerciseDtoForCreate.getImageUrl());
            exercise.setVideoUrlPl(exerciseDtoForCreate.getVideoUrl());
            exercise.setIsPrivate(exerciseDtoForCreate.isPrivate());
            exercise.setCreatorId(userService.getUserId());
            exercise.setMainMuscle(exerciseDtoForCreate.getMainMuscle());
            exercise.setRegion(exerciseDtoForCreate.getRegion());
        }

        if (userService.getLang().equals("de")){

            exercise.setNameDe(exerciseDtoForCreate.getName());
            exercise.setDescriptionDe(exerciseDtoForCreate.getDescription());
            exercise.setImageUrl(exerciseDtoForCreate.getImageUrl());
            exercise.setVideoUrlDe(exerciseDtoForCreate.getVideoUrl());
            exercise.setIsPrivate(exerciseDtoForCreate.isPrivate());
            exercise.setCreatorId(userService.getUserId());
            exercise.setMainMuscle(exerciseDtoForCreate.getMainMuscle());
            exercise.setRegion(exerciseDtoForCreate.getRegion());
        }

        if (userService.getLang().equals("en")){

            exercise.setName(exerciseDtoForCreate.getName());
            exercise.setDescription(exerciseDtoForCreate.getDescription());
            exercise.setImageUrl(exerciseDtoForCreate.getImageUrl());
            exercise.setVideoUrl(exerciseDtoForCreate.getVideoUrl());
            exercise.setIsPrivate(exerciseDtoForCreate.isPrivate());
            exercise.setCreatorId(userService.getUserId());
            exercise.setMainMuscle(exerciseDtoForCreate.getMainMuscle());
            exercise.setRegion(exerciseDtoForCreate.getRegion());

        }


       repository.save(exercise);

    }

    public Page<ExerciseDto> getAllExercisesPagePublicAndForUser(int page, int size, String search) {

        String searchToLowerCase = search.toLowerCase();

        Pageable pageable = PageRequest.of(page, size);

        String lang = userService.getLang();

        if (lang.equals("pl")){

            Page<Exercise> exercises = repository.findByIsPrivateFalseOrCreatorIdPl(userService.getUserId(),searchToLowerCase,pageable);


            return exercises.map(ExerciseMapper::toDto);

        } else if (lang.equals("de")) {

            Page<Exercise> exercises = repository.findByIsPrivateFalseOrCreatorIdDe(userService.getUserId(),searchToLowerCase,pageable);


            return exercises.map(ExerciseMapper::toDto);

        } else

        {

            Page<Exercise> exercises = repository.findByIsPrivateFalseOrCreatorId(userService.getUserId(),searchToLowerCase,pageable);


            return exercises.map(ExerciseMapper::toDto);

        }

    }

    public Optional<Exercise> getExerciseById(long id) {

        return repository.findByIdAndIsPrivateFalseOrCreatorId(id, userService.getUserId());
    }

    public boolean edit(long id, ExerciseDtoForEdit exerciseDtoForEdit) {

        Optional<Exercise> exerciseToEdit = repository.findByIdAccessOnlyCreatorId(id, userService.getUserId());

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

            repository.save(exerciseToEdit.get());

            return true;
        }

        return false;

    }


    public Set<String> getMainMusclesForDay(long dayId) {


        Optional<Day> day = dayService.getDay(dayId);

        if(day.isEmpty()){
            return new HashSet<>();
        }
            return day.stream()
                    .flatMap(day1 -> day1.getExercisePlans().stream())
                    .map(exercisePlan -> exercisePlan.getExercise().getMainMuscle())
                    .collect(Collectors.toSet());
    }

    public boolean delete(long id) {

        Optional<Exercise> exercise = repository.findByIdAccessOnlyCreatorId(id, userService.getUserId());

        if (exercise.isPresent()) {

            repository.delete(exercise.get());
            return true;
        }

        return false;
    }


    public ResponseEntity<List<ExerciseDtoForNameList>> getExerciseNameList(List<Long> listId) {


        Optional<List<Exercise>> exerciseList = repository.findByIdListAndIsPrivateFalseOrCreatorId(listId, userService.getUserId());


        if (exerciseList.isPresent()) {

            List<ExerciseDtoForNameList> exerciseDtoForNameLists = new ArrayList<>();

            for (Exercise exercise : exerciseList.get()) {

                exerciseDtoForNameLists.add(ExerciseMapper.toNameListDto(exercise));
            }

            return ResponseEntity.ok(exerciseDtoForNameLists);

        }

        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> addEmbeddingsForAnyExercises() {

        List<Exercise> allExercises = repository.findAll();

        int successCount = 0;
        int failCount = 0;

        for (Exercise exercise : allExercises) {

            if (exercise.getEmbedding() == null || exercise.getEmbedding().isEmpty()) {

                try {

                    ResponseEntity<String> response = restTemplate.exchange(
                            EMBEDDING_URL + "?exerciseName=" + exercise.getName(),
                            HttpMethod.POST,
                            null,
                            String.class
                    );

                    exercise.setEmbedding(response.getBody());
                    repository.save(exercise);
                    successCount++;

                } catch (Exception e) {

                    System.err.println("Error processing exercise ID: " + exercise.getId()
                            + ", name: " + exercise.getName()
                            + " - " + e.getMessage());
                    failCount++;
                }
            }
        }

        return ResponseEntity.ok("Successfully updated " + successCount + " exercises. "
                + failCount + " failed.");
    }


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


        return repository.findByMainMuscleInAndIsPrivateFalseOrCreatorId(mainMuscleList, userService.getUserId());


    }


    public List<Exercise> findAll() {

        return repository.findAll();
    }
}
