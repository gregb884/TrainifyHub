package org.gregb884.aiassist.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OptionalExercise {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long exerciseId;
    private String name;
    private String namePl;
    private String nameDe;
    private String imageUrl;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "ai_exercise_id")
    private AiExercise aiExercise;

    @Column(nullable = false)
    private boolean isSelected = false;

}
