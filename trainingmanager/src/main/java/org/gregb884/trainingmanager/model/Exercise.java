package org.gregb884.trainingmanager.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    private String name;
    private String namePl;
    private String nameDe;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String descriptionPl;
    private String descriptionDe;
    private String additionalInfo;
    private String imageUrl;
    private String videoUrl;
    private String videoUrlPl;
    private String videoUrlDe;
    @NonNull
    private Boolean isPrivate;
    private long creatorId;
    private long forUserId;
    private String mainMuscle;
    private String region;

    @JsonBackReference
    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ExercisePlan> exercisePlans;


    @Column(columnDefinition = "TEXT")
    @JsonIgnore
    private String embedding;


}
