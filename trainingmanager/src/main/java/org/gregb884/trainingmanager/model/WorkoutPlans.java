package org.gregb884.trainingmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlans {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    long planId;

    String imageUrl;

    String title;

    String titlePl;

    String titleDe;

    @Column(columnDefinition = "TEXT", length = Integer.MAX_VALUE)
    String shortDescription;

    @Column(columnDefinition = "TEXT", length = Integer.MAX_VALUE)
    String shortDescriptionPl;

    @Column(columnDefinition = "TEXT", length = Integer.MAX_VALUE)
    String shortDescriptionDe;

    @Column(columnDefinition = "TEXT", length = Integer.MAX_VALUE)
    String description;

    @Column(columnDefinition = "TEXT", length = Integer.MAX_VALUE)
    String descriptionPl;

    @Column(columnDefinition = "TEXT", length = Integer.MAX_VALUE)
    String descriptionDe;

    int trainingDaysCount;

    String muscles;
    String gender;

    String lang;

}
