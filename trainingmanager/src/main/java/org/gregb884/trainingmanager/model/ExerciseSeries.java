package org.gregb884.trainingmanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSeries {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private int totalRepetitions;
    private double totalWeight;
    private String  additionalInfo;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "exercise_plan_id")
    private ExercisePlan exercisePlan;


}
