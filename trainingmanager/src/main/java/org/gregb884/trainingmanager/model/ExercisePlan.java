package org.gregb884.trainingmanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExercisePlan {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private int plannedRepetitions;
    private double plannedWeight;
    private int plannedSeries;
    private String tempo;
    private String additionalInfo;
    private String returnDescription;
    private int exerciseOrder;



    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "day_id")
    private Day day;

    @ManyToOne
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @JsonManagedReference
    @OrderBy("id ASC")
    @OneToMany(mappedBy = "exercisePlan", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private Set<ExerciseSeries> exerciseSeries;

}
