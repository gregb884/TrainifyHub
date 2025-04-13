package org.gregb884.trainingmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseStatsDto {


    private int reps;
    private double weight;
    private long exerciseId;

}
