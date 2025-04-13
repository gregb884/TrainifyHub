package org.gregb884.trainingmanager.dto.aiModels;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiTrainingPlan {

    private Long id;
    private Long userId;
    private String planName;
    private String description;
    private List<Day> aiDays;
    private String additionalNotes;


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Day {
        private Long id;
        private String dayName;
        private List<Exercise> aiExercises;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Exercise {
        private Long id;
        private String exerciseName;
        private int repetitions;
        private int plannedSeries;
        private int rest;
        private List<OptionalExercise> optionalExerciseList;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionalExercise {
        private Long id;
        private Long exerciseId;
        private String name;
        private String namePl;
        private String nameDe;
        private String imageUrl;
        private boolean selected;
    }


    }
