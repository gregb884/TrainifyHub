package org.gregb884.trainingmanager.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExerciseDtoForCreate {


    private String name;
    private String description;
    private String imageUrl;
    private String videoUrl;
    private Boolean isPrivate;
    private String mainMuscle;
    private String additionalInfo;
    private String region;


    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public boolean isPrivate() {
        return isPrivate;
    }
}
