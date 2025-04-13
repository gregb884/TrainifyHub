package org.gregb884.aiassist.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseDtoForAi {

    long id;
    private String name;
    private String namePl;
    private String nameDe;
    private String imageUrl;

}
