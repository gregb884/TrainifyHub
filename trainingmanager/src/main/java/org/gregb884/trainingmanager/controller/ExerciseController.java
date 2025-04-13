package org.gregb884.trainingmanager.controller;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.dto.*;
import org.gregb884.trainingmanager.mapper.ExerciseMapper;
import org.gregb884.trainingmanager.model.Exercise;
import org.gregb884.trainingmanager.service.AiService;
import org.gregb884.trainingmanager.service.ExerciseService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/exercise")
public class ExerciseController {

    private final ExerciseService exerciseService;
    private final AiService aiService;

    public ExerciseController(ExerciseService exerciseService, AiService aiService) {
        this.exerciseService = exerciseService;
        this.aiService = aiService;
    }


    @Transactional
    @PostMapping("/addNew")
    public ResponseEntity<String> addNewExercise(@RequestBody ExerciseDtoForCreate exerciseDtoForCreate) {

        exerciseService.createNewExercise(exerciseDtoForCreate);

        return ResponseEntity.ok().body("Exercise added") ;
    }


    @Transactional
    @GetMapping("/pageOfAll")
    public ResponseEntity<Page<ExerciseDto>> getAllExercisesForUserAndPublicPageView(@RequestParam(defaultValue = "0") int page,
                                                                                     @RequestParam(defaultValue = "5") int size,
                                                                                     @RequestParam(required = false) String search) {

        return ResponseEntity.ok(exerciseService.getAllExercisesPagePublicAndForUser(page,size,search));

    }

    @Transactional
    @GetMapping("/getId")
    public ResponseEntity<Optional <Exercise>> getExercise(@RequestParam int id) {

        Optional<Exercise> exercise = exerciseService.getExerciseById(id);

        if (exercise.isEmpty()) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(exercise);
    }

    @GetMapping("/getName")
    public ResponseEntity<ExerciseNameDto> getExerciseName(@RequestParam int id) {


        Optional<Exercise> exercise = exerciseService.getExerciseById(id);

        if (!exercise.isEmpty()) {

            return ResponseEntity.ok(ExerciseMapper.toNameDto(exercise.get()));

        }

        return ResponseEntity.notFound().build();

    }

    @PostMapping("/getNameList")
    public ResponseEntity<List<ExerciseDtoForNameList>> getExerciseNameList(@RequestBody List<Long> listId) {


        return exerciseService.getExerciseNameList(listId);

    }


    @Transactional
    @PutMapping("/edit")
    public ResponseEntity<String> editExercise(@RequestParam int id,@RequestBody ExerciseDtoForEdit exerciseDtoForEdit) {


       if(exerciseService.edit(id,exerciseDtoForEdit)){
           return ResponseEntity.ok().body("Exercise saved with id " + id + " and name " + exerciseDtoForEdit.getName());
       }else
           return ResponseEntity.notFound().build();
    }

    @GetMapping("/mainMuscle")
    public ResponseEntity<Set<String>> getMainMuscles(@RequestParam long dayId) {

       Set<String> muslceSet =  exerciseService.getMainMusclesForDay(dayId);

       return ResponseEntity.ok(muslceSet);
    }


    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteExercise(@RequestParam long id) {


        if (exerciseService.delete(id))
        {
            return ResponseEntity.ok().body("Exercise deleted");
        }

        return ResponseEntity.notFound().build();
    }


    @GetMapping("/createEmbeddings")
    public ResponseEntity<String> createEmbeddings() {

       return exerciseService.addEmbeddingsForAnyExercises();

    }


    @GetMapping("/findMatch")
    public List<ExerciseDtoForAi> findMatch(@RequestParam String exerciseName) {

       return aiService.findMostSimilarExercises(exerciseName);

    }

    @GetMapping("/getListForMuscleEn")
    public ResponseEntity<List<ExerciseDtoOnlyEnName>> getListForMuscleEn(@RequestParam String mainMuscle) {

        return ResponseEntity.ok(exerciseService.exerciseDtoOnlyEnNames(mainMuscle));

    }




}
