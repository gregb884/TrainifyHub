package org.gregb884.trainingmanager.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class ExerciseDtoForAi {


    long id;
    private String name;
    private String namePl;
    private String nameDe;
    private String imageUrl;


    public ExerciseDtoForAi() {
    }

    public ExerciseDtoForAi(long id, String name, String namePl, String nameDe, String imageUrl) {
        this.id = id;
        this.name = name;
        this.namePl = namePl;
        this.nameDe = nameDe;
        this.imageUrl = imageUrl;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNamePl() {
        return namePl;
    }

    public void setNamePl(String namePl) {
        this.namePl = namePl;
    }

    public String getNameDe() {
        return nameDe;
    }

    public void setNameDe(String nameDe) {
        this.nameDe = nameDe;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
