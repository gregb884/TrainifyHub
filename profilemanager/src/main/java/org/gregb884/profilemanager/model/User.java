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
@Table(name = "users")
public class User {


    @Id
    private long id;
    private String username;
    private String firstName;
    private String lastName;
    private String region;
    private String imageUrl;

    private String fitnessLevel;
    private String fitnessGoal;
    private String trainingPreferences;
    private int trainingFrequency;
    private String trainingLocation;

    private double height;
    private double weight;
    private String medicalHistory;
    private String currentIssues;
    private String dietaryRestrictions;

    private String phoneNumber;
    private String email;

    private String planType;
    private String trainerPreferences;

    private String city;
    private String availability;

    private double targetWeight;
    private String targetBodyFatPercentage;

    private double chestCircumference;
    private double waistCircumference;
    private double hipCircumference;
    private double armCircumference;
    private double thighCircumference;
    private double calfCircumference;

    @JsonBackReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Request> request;


    public double getBmi() {
        if (height > 0) {

           double height1 = height / 100;
            return weight / (height1 * height1);
        } else {
            return 0;
        }
    }

}
