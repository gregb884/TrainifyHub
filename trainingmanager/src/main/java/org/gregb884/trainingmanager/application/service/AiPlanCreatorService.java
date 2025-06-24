package org.gregb884.trainingmanager.application.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.aiModels.AiTrainingPlan;
import org.gregb884.trainingmanager.application.port.in.*;
import org.gregb884.trainingmanager.application.port.out.AiPlanPort;
import org.gregb884.trainingmanager.domain.model.*;
import org.gregb884.trainingmanager.domain.service.DateHelper;
import org.gregb884.trainingmanager.domain.service.ExerciseSeriesDomainService;
import org.gregb884.trainingmanager.domain.service.TrainingPlanDomainService;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class AiPlanCreatorService implements AiPlanCreatorUseCase {


    private final AiPlanPort aiPlanPort;
    private final AuthenticatedUser authenticatedUser;
    private final ExerciseUseCase exerciseUseCase;
    private final TrainingPlanDomainService trainingPlanDomainService;
    private final TrainingPlanUseCase trainingPlanUseCase;
    private final UserUseCase userUseCase;
    private final EntityCreatorUseCase entityCreatorUseCase;


    @Override
    @Transactional
    public Long createAiPlan(Long aiTrainingPlanId, Date startDate , String days) throws Exception {

        AiTrainingPlan aiTrainingPlan = aiPlanPort.downloadAiPlan(aiTrainingPlanId);

        User user = userUseCase.findById(authenticatedUser.getUserId());

        Map<Long,Exercise> exerciseMap = exerciseUseCase.exerciseMapWithIdForAiTrainingPlan(aiTrainingPlan);

        TrainingPlan newTrainingPlan = trainingPlanDomainService.createPlanFromAiPlan(aiTrainingPlan,startDate,days,user, exerciseMap);

        newTrainingPlan = trainingPlanUseCase.saveTrainingPlan(newTrainingPlan);

        entityCreatorUseCase.createNext3WeekForAiPlan(newTrainingPlan);

        return newTrainingPlan.getId();

    }




}
