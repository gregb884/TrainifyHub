package org.gregb884.aiassist.application.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class RequestCreateDto {

    private String goal;
    private String experience;
    private String days;
    private int sessionTime;
    private String equipment;
    private String preferences;
    private long lastPlanId;
    private Date startDate;
    private boolean previousOk;
    private String primaryFocus;

}
