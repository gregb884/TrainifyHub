package org.gregb884.profilemanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "trainers")
public class Trainer {

    @Id
    private long id;
    private String username;
    private String firstName;
    private String lastName;
    private String region;
    private String description;
    private String professionalExperience;
    private String trainingExperience;
    private String trainingPlanPriceIncludes;
    private String city;
    private String club;
    private String email;
    private String phone;
    private String instagram;
    private String priceFrom;
    private String priceTo;
    private String whatDoesTheCooperationLookLike;
    private String specialization;
    private String history;
    private String imageUrl;
    private boolean IsPublic;

    @JsonBackReference
    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Request> request;

}
