package org.gregb884.aiassist.domain.model;

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
@Table(name = "ai_day")
public class AiDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayName;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "aiplan_id")
    private AiPlan aiPlan;

    @JsonManagedReference
    @OneToMany(mappedBy = "aiDay", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AiExercise> aiExercises;

}