package org.gregb884.statistic.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ExerciseStats {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private int reps;
    private double weight;
    private long exerciseId;
    private double oneRepMax;
    private Date addDate;

    @PrePersist
    @PreUpdate
    public void calculateOneRepMax() {
        this.oneRepMax = Math.round(weight * (1 + (reps / 30.0)));
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
