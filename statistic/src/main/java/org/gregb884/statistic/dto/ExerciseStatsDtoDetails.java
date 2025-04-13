package org.gregb884.statistic.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseStatsDtoDetails {


    private long id;
    private int reps;
    private double weight;
    private long exerciseId;
    private double oneRepMax;
    private Date addDate;


    public ExerciseStatsDtoDetails(int avgReps, double avgWeight, double avgOneRepMax, Date date) {

        this.reps = avgReps;
        this.weight = avgWeight;
        this.oneRepMax = avgOneRepMax;
        this.addDate = date;

    }
}
