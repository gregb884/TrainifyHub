package org.gregb884.trainingmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseDtoForNameList {

    long id;
    private String name;
    private String namePl;
    private String nameDe;

}
