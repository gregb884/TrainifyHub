package org.gregb884.trainingmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseDto {

    private long id;
    private String name;
    private String namePl;
    private String nameDe;
    private String imageUrl;
    private String description;
    private String descriptionPl;
    private String descriptionDe;
    private String videoUrl;
    private String videoUrlPl;
    private String videoUrlDe;
    private String mainMuscle;
    private Boolean isPrivate;
    private long creatorId;
}
