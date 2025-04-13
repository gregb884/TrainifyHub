package org.gregb884.trainingmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExerciseDtoForEdit {

    private String name;
    private String namePl;
    private String nameDe;
    private String description;
    private String descriptionPl;
    private String descriptionDe;
    private String imageUrl;
    private String videoUrl;
    private String videoUrlPl;
    private String videoUrlDe;
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
