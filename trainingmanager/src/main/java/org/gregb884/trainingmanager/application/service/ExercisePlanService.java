package org.gregb884.trainingmanager.application.service;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.ExercisePlanDto;
import org.gregb884.trainingmanager.application.mapper.ExercisePlanMapper;
import org.gregb884.trainingmanager.application.port.in.*;
import org.gregb884.trainingmanager.domain.model.Day;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.repository.DayRepositoryPort;
import org.gregb884.trainingmanager.domain.repository.ExercisePlanRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ExercisePlanService implements ExercisePlanUseCase {


    private final ExercisePlanRepositoryPort exercisePlanRepository;
    private final ExercisePlanMapper exercisePlanMapper;
    private final DayRepositoryPort dayRepository;
    private final ExerciseUseCase exerciseUseCase;
    private final ExerciseSeriesUseCase exerciseSeriesUseCase;
    private final AuthenticatedUser authenticatedUser;


    @Override
    public void create(long dayId, ExercisePlanDto exercisePlanDto, long exerciseId) throws Exception {

        Optional<Day> day = dayRepository.findByIdAndUserIdOrCreatorId(dayId,authenticatedUser.getUserId());
        Optional<Exercise> exercise = exerciseUseCase.getExerciseById(exerciseId);

        if (day.isEmpty() || exercise.isEmpty()) {throw new Exception("No day or exercise found");}

            ExercisePlan exercisePlan = exercisePlanMapper.toDomain(exercisePlanDto);
            exercisePlan.setDay(day.get());
            exercisePlan.setExercise(exercise.get());
            exercisePlanRepository.save(exercisePlan);
            exercisePlan.setExerciseSeries(exerciseSeriesUseCase.createSeriesForPlan(exercisePlan));

    }



    @Override
    public Optional<ExercisePlan> getExercisePlan(long exercisePlanId) {

        return exercisePlanRepository.findByIdAndUserIdOrCreatorId(exercisePlanId,authenticatedUser.getUserId());
    }


    @Override
    public boolean delete(long exercisePlanId) {

        Optional<ExercisePlan> exercisePlan = getExercisePlan(exercisePlanId);

        if (exercisePlan.isPresent()) {
            exercisePlanRepository.delete(exercisePlan.get());
            return true;
        }

        return false;
    }

    @Override
    public void edit(ExercisePlanDto exercisePlanDto, long exercisePlanId) throws Exception {


        Optional<ExercisePlan> exercisePlan = getExercisePlan(exercisePlanId);

        if (exercisePlan.isEmpty()) { throw new Exception("No exercise plan found"); }

            ExercisePlan exercisePlanToEdit = exercisePlan.get();
            exercisePlanToEdit.setPlannedRepetitions(exercisePlanDto.getPlannedRepetitions());
            exercisePlanToEdit.setPlannedWeight(exercisePlanDto.getPlannedWeight());

            if (exercisePlanToEdit.getPlannedSeries() != exercisePlanDto.getPlannedSeries()) {

                exercisePlanToEdit.setPlannedSeries(exercisePlanDto.getPlannedSeries());

                exerciseSeriesUseCase.deleteListExerciseSeries(exercisePlanToEdit.getExerciseSeries());

                exercisePlanToEdit.getExerciseSeries().clear();

                exercisePlanToEdit.setExerciseSeries(exerciseSeriesUseCase.createSeriesForPlan(exercisePlanToEdit));
            }

            exercisePlanRepository.save(exercisePlanToEdit);

    }



}
