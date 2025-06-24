package org.gregb884.trainingmanager.infrastructure.adapter.in.controller;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.*;
import org.gregb884.trainingmanager.application.mapper.ExerciseNameDtoMapper;
import org.gregb884.trainingmanager.application.port.in.ExerciseUseCase;
import org.gregb884.trainingmanager.domain.dto.ExerciseDtoForAi;
import org.gregb884.trainingmanager.domain.dto.ExerciseDtoOnlyEnName;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/api/exercise")
public class ExerciseController {


    private final ExerciseUseCase exerciseUseCase;
    private final ExerciseNameDtoMapper exerciseNameDtoMapper;

    @Transactional
    @PostMapping("/addNew")
    public ResponseEntity<String> addNewExercise(@RequestBody ExerciseDtoForCreate exerciseDtoForCreate) {

        exerciseUseCase.createNewExercise(exerciseDtoForCreate);

        return ResponseEntity.ok().body("Exercise added") ;
    }


    @Transactional
    @GetMapping("/pageOfAll")
    public ResponseEntity<Page<ExerciseDto>> getAllExercisesForUserAndPublicPageView(@RequestParam(defaultValue = "0") int page,
                                                                                     @RequestParam(defaultValue = "5") int size,
                                                                                     @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(exerciseUseCase.getAllExercisesPagePublicAndForUser(pageable,search));

    }

    @Transactional
    @GetMapping("/getId")
    public ResponseEntity<Optional<Exercise>> getExercise(@RequestParam int id) {

        Optional<Exercise> exercise = exerciseUseCase.getExerciseById(id);

        if (exercise.isEmpty()) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(exercise);
    }

    @GetMapping("/getName")
    public ResponseEntity<ExerciseNameDto> getExerciseName(@RequestParam int id) {

        Optional<Exercise> exercise = exerciseUseCase.getExerciseById(id);

        return exercise.map(value -> ResponseEntity.ok(exerciseNameDtoMapper.toDto(value))).orElseGet(() -> ResponseEntity.notFound().build());

    }

    @PostMapping("/getNameList")
    public ResponseEntity<List<ExerciseDtoForNameList>> getExerciseNameList(@RequestBody List<Long> listId) {

        try {
            return ResponseEntity.ok(exerciseUseCase.getExerciseNameList(listId));
        } catch (Exception e){
            return ResponseEntity.notFound().build();
        }

    }


    @Transactional
    @PutMapping("/edit")
    public ResponseEntity<String> editExercise(@RequestParam int id,@RequestBody ExerciseDtoForEdit exerciseDtoForEdit) {


       if(exerciseUseCase.edit(id,exerciseDtoForEdit)){
           return ResponseEntity.ok().body("Exercise saved with id " + id + " and name " + exerciseDtoForEdit.getName());
       }else
           return ResponseEntity.notFound().build();
    }

    @GetMapping("/mainMuscle")
    public ResponseEntity<Set<String>> getMainMuscles(@RequestParam long dayId) {

       Set<String> muslceSet =  exerciseUseCase.getMainMusclesForDay(dayId);

       return ResponseEntity.ok(muslceSet);
    }


    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteExercise(@RequestParam long id) {


        if (exerciseUseCase.delete(id))
        {
            return ResponseEntity.ok().body("Exercise deleted");
        }

        return ResponseEntity.notFound().build();
    }


    @GetMapping("/createEmbeddings")
    public ResponseEntity<String> createEmbeddings() {

        return ResponseEntity.ok(exerciseUseCase.addEmbeddingForAnyExercises());

    }


    @GetMapping("/findMatch")
    public List<ExerciseDtoForAi> findMatch(@RequestParam String exerciseName) {

        try {
            return exerciseUseCase.searchMostSimilarExercises(exerciseName);
        } catch (Exception e){
            return new ArrayList<>();
        }
    }

    @GetMapping("/getListForMuscleEn")
    public ResponseEntity<List<ExerciseDtoOnlyEnName>> getListForMuscleEn(@RequestParam String mainMuscle) {

        return ResponseEntity.ok(exerciseUseCase.exerciseDtoOnlyEnNames(mainMuscle));

    }




}
