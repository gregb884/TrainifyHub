package org.gregb884.trainingmanager.service;

import org.gregb884.trainingmanager.dto.ExercisePlanDto;
import org.gregb884.trainingmanager.model.Day;
import org.gregb884.trainingmanager.model.Exercise;
import org.gregb884.trainingmanager.model.ExercisePlan;
import org.gregb884.trainingmanager.model.ExerciseSeries;
import org.gregb884.trainingmanager.repository.ExercisePlanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ExercisePlanService {


    private final ExercisePlanRepository repository;
    private final DayService dayService;
    private final UserService userService;
    private final ExerciseService exerciseService;
    private final ExerciseSeriesService exerciseSeriesService;


    public ExercisePlanService(ExercisePlanRepository repository, DayService dayService, UserService userService, ExerciseService exerciseService, ExerciseSeriesService exerciseSeriesService) {
        this.repository = repository;
        this.dayService = dayService;
        this.userService = userService;
        this.exerciseService = exerciseService;
        this.exerciseSeriesService = exerciseSeriesService;
    }


    public ResponseEntity<String> create(long dayId, ExercisePlanDto exercisePlanDto, long exerciseId) {

        Optional<Day> day = dayService.getDay(dayId);
        Optional<Exercise> exercise = exerciseService.getExerciseById(exerciseId);

        if (day.isPresent() && exercise.isPresent()) {

            ExercisePlan exercisePlan = new ExercisePlan();
            exercisePlan.setPlannedRepetitions(exercisePlanDto.getPlannedRepetitions());
            exercisePlan.setPlannedWeight(exercisePlanDto.getPlannedWeight());
            exercisePlan.setPlannedSeries(exercisePlanDto.getPlannedSeries());
            exercisePlan.setTempo(exercisePlanDto.getTempo());
            exercisePlan.setAdditionalInfo(exercisePlanDto.getAdditionalInfo());
            exercisePlan.setReturnDescription(exercisePlanDto.getReturnDescription());
            exercisePlan.setDay(day.get());
            exercisePlan.setExercise(exercise.get());
            exercisePlan.setExerciseOrder(exercisePlanDto.getExerciseOrder());
            repository.save(exercisePlan);
            exercisePlan.setExerciseSeries(exerciseSeriesService.createSeriesForPlan(exercisePlan));
            return ResponseEntity.ok("Exercise plan created");
        }

        return ResponseEntity.notFound().build();
    }


    public Optional<ExercisePlan> getExercisePlan(long exercisePlanId) {


        return repository.findByIdAndUserIdOrCreatorId(exercisePlanId,userService.getUserId());
    }


    public boolean delete(long exercisePlanId) {

        Optional<ExercisePlan> exercisePlan = getExercisePlan(exercisePlanId);

        if (exercisePlan.isPresent()) {
            repository.delete(exercisePlan.get());
            return true;
        }

        return false;
    }

    public void duplicateExercisePlan(Set<Day> newWeekDays, Set<Day> oldWeekDays) {

        for (Day day : oldWeekDays) {

            Day newDay = newWeekDays.stream().filter(day1 -> day1.getName().equals(day.getName())).findFirst().get();

            Set<ExercisePlan> exercisePlanFromOldDay = day.getExercisePlans();


           for (ExercisePlan exercisePlan : exercisePlanFromOldDay) {

               final ExercisePlanDto exercisePlanDto = getExercisePlanDto(exercisePlan);
               create(newDay.getId(),exercisePlanDto,exercisePlan.getExercise().getId());
           }

        }


    }

    private static ExercisePlanDto getExercisePlanDto(ExercisePlan exercisePlan) {
        ExercisePlanDto exercisePlanDto = new ExercisePlanDto();
        exercisePlanDto.setPlannedRepetitions(exercisePlan.getPlannedRepetitions());
        exercisePlanDto.setPlannedWeight(exercisePlan.getPlannedWeight());
        exercisePlanDto.setPlannedSeries(exercisePlan.getPlannedSeries());
        exercisePlanDto.setTempo(exercisePlan.getTempo());
        exercisePlanDto.setAdditionalInfo(exercisePlan.getAdditionalInfo());
        exercisePlanDto.setExerciseOrder(exercisePlan.getExerciseOrder());
        return exercisePlanDto;
    }

    public ResponseEntity<String> edit(ExercisePlanDto exercisePlanDto, long exercisePlanId) {


        Optional<ExercisePlan> exercisePlan = getExercisePlan(exercisePlanId);

        if (exercisePlan.isPresent()) {

            ExercisePlan exercisePlanToEdit = exercisePlan.get();
            exercisePlanToEdit.setPlannedRepetitions(exercisePlanDto.getPlannedRepetitions());
            exercisePlanToEdit.setPlannedWeight(exercisePlanDto.getPlannedWeight());

            if (exercisePlanToEdit.getPlannedSeries() != exercisePlanDto.getPlannedSeries()) {

                exercisePlanToEdit.setPlannedSeries(exercisePlanDto.getPlannedSeries());

                exerciseSeriesService.deleteListExerciseSeries(exercisePlanToEdit.getExerciseSeries());

                exercisePlanToEdit.getExerciseSeries().clear();

                exercisePlanToEdit.setExerciseSeries(exerciseSeriesService.createSeriesForPlan(exercisePlanToEdit));
            }

            repository.save(exercisePlanToEdit);

            return ResponseEntity.ok("Exercise plan updated");

        }

        return ResponseEntity.notFound().build();

    }
}
