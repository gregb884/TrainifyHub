package org.gregb884.aiassist.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestDto {

    private Long id;
    private String goal;
    private String experience;
    private String days;
    private int sessionTime;
    private String equipment;
    private String preferences;
    private long lastPlanId;
    private String lastPlanDescription;
    private long userId;
    private long generatedPlanId;
    private Date startDate;
    private boolean previousOk;
    private String primaryFocus;
    private String aiAnswer;
    private long aiPlanId;
    private Boolean isRendering;

}
