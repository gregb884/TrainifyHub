package org.gregb884.profilemanager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDto {

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


}
