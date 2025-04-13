package org.gregb884.statistic.dto;

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


    public double calculateOneRepMax() {
       return Math.round(weight * (1 + (reps / 30.0)));
    }

}
