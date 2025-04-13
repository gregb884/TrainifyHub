package org.gregb884.trainingmanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    long id;

    String username;


    @JsonBackReference
    @ManyToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY, mappedBy = "users")
    private Set<TrainingPlan> trainingPlans = new HashSet();

}
