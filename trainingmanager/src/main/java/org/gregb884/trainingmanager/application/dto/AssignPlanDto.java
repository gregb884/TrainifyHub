package org.gregb884.trainingmanager.application.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
public class AssignPlanDto {


    private Date startDate;
    private Set<Integer> weekDay;
}
