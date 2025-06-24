package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.TrainingPlanDto;
import org.gregb884.trainingmanager.application.dto.TrainingPlanSimpleViewDto;
import org.gregb884.trainingmanager.application.dto.TrainingPlanViewTemplateDto;
import org.gregb884.trainingmanager.domain.dto.TrainingPlanDtoWithDate;
import org.gregb884.trainingmanager.domain.dto.TrainingPlanSummaryDto;
import org.gregb884.trainingmanager.domain.model.TrainingPlan;

import java.util.List;
import java.util.Optional;

public interface TrainingPlanUseCase {

    void setToCheck(TrainingPlan trainingPlan);
    TrainingPlan getViewSingleOnlyCreatorId(long id);
    TrainingPlan saveTrainingPlan(TrainingPlan trainingPlan);
    long countTraineeWithMyTrainingPlans(long userId);
    long countTraineeWithMyTrainingPlans();
    List<String> listTraineeWithMyTrainingPlans(long userId);
    List<String> listTraineeWithMyTrainingPlans();
    long newPlanForYourself(TrainingPlanDto trainingPlanDto);
    TrainingPlan getViewSingle(long id) throws Exception;
    TrainingPlanSummaryDto getTrainingPlanSummary(long id) throws Exception;
    long sumPlans();
    Long sumSchema() throws Exception;
    Long sumPlanToCheck();
    void setPlanToChecked(long id) throws Exception;
    long myPlans();
    Optional<Long> userInTrainingPlan(long id);
    List<TrainingPlan> getAllPlans();
    TrainingPlanDtoWithDate getNearestDay() throws Exception;
    List<TrainingPlanSimpleViewDto> getAllPlansSimpleDto();
    long newPlanForUser(String email,TrainingPlanDto trainingPlanDto);
    List<TrainingPlanViewTemplateDto> myTemplateView() throws Exception;
    boolean delete(long id);
}
