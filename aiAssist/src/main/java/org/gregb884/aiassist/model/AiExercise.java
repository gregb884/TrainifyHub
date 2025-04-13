package org.gregb884.aiassist.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiExercise {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String exerciseName;

    private int repetitions;
    private int plannedSeries;
    private int rest;

    @JsonManagedReference
    @OrderColumn(name = "exercise_order")
    @OneToMany(mappedBy = "aiExercise", cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
    private List<OptionalExercise> optionalExerciseList;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "ai_day_id")
    private AiDay aiDay;



}
