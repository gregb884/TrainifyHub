package org.gregb884.profilemanager.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

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


}
