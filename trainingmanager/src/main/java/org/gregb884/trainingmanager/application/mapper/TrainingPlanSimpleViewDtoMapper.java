package org.gregb884.trainingmanager.application.mapper;

import org.gregb884.trainingmanager.application.dto.TrainingPlanSimpleViewDto;
import org.gregb884.trainingmanager.domain.model.TrainingPlan;

public class TrainingPlanSimpleViewDtoMapper {



    public TrainingPlanSimpleViewDto convertToSimpleDto(TrainingPlan trainingPlan) {

        TrainingPlanSimpleViewDto dto = new TrainingPlanSimpleViewDto();
        dto.setId(trainingPlan.getId());
        dto.setName(trainingPlan.getName());
        return dto;
    }



}
