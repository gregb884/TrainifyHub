package org.gregb884.trainingmanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainingPlan {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
    private Boolean template;
    private Boolean checked;
    private long creatorId;

    @ManyToMany
    @JsonManagedReference
    @JoinTable(inverseJoinColumns = @JoinColumn(name = "user_id"),joinColumns = @JoinColumn(name = "training_id"))
    private Set<User> users = new HashSet<>();

    @OrderBy("startDate ASC")
    @JsonManagedReference
    @OneToMany(mappedBy = "trainingPlan",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private Set<Week> weeks;





}
