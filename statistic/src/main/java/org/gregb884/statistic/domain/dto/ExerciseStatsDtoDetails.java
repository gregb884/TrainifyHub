package org.gregb884.statistic.domain.dto;

import java.util.Date;

public class ExerciseStatsDtoDetails {


    private long id;
    private int reps;
    private double weight;
    private long exerciseId;
    private double oneRepMax;
    private Date addDate;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public double getOneRepMax() {
        return oneRepMax;
    }

    public void setOneRepMax(double oneRepMax) {
        this.oneRepMax = oneRepMax;
    }

    public Date getAddDate() {
        return addDate;
    }

    public void setAddDate(Date addDate) {
        this.addDate = addDate;
    }

    public ExerciseStatsDtoDetails(int avgReps, double avgWeight, double avgOneRepMax, Date date) {

        this.reps = avgReps;
        this.weight = avgWeight;
        this.oneRepMax = avgOneRepMax;
        this.addDate = date;

    }

    public ExerciseStatsDtoDetails() {}


}