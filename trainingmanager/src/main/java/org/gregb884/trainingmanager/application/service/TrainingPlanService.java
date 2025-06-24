package org.gregb884.trainingmanager.application.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.*;
import org.gregb884.trainingmanager.application.mapper.TrainingPlanSimpleViewDtoMapper;
import org.gregb884.trainingmanager.application.port.in.TrainingPlanUseCase;
import org.gregb884.trainingmanager.application.port.in.UserUseCase;
import org.gregb884.trainingmanager.application.port.out.AccessToPaidPlansCheckPort;
import org.gregb884.trainingmanager.application.port.out.NotificationPort;
import org.gregb884.trainingmanager.domain.dto.TrainingPlanDtoWithDate;
import org.gregb884.trainingmanager.domain.dto.TrainingPlanSummaryDto;
import org.gregb884.trainingmanager.domain.model.*;
import org.gregb884.trainingmanager.domain.repository.TrainingPlanRepositoryPort;
import org.gregb884.trainingmanager.domain.service.*;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TrainingPlanService implements TrainingPlanUseCase {

    private final TrainingPlanRepositoryPort trainingPlanRepository;
    private final AuthenticatedUser authenticatedUser;
    private final AccessToPaidPlansCheckPort accessToPaidPlansCheckPort;
    private final TrainingPlanSimpleViewDtoMapper trainingPlanSimpleViewDtoMapper = new TrainingPlanSimpleViewDtoMapper();
    private final TrainingPlanDomainService trainingPlanDomainService;
    private final UserUseCase userUseCase;
    private final NotificationPort notificationPort;

    @Override
    public void setToCheck(TrainingPlan trainingPlan){

            trainingPlan.setChecked(false);
            trainingPlanRepository.save(trainingPlan);
        }

    @Override
    public long countTraineeWithMyTrainingPlans(long userId){

        return trainingPlanRepository.countDistinctUserIdsByCreatorIdOrUserId(userId);
    }

    @Override
    public long countTraineeWithMyTrainingPlans(){

        return trainingPlanRepository.countDistinctUserIdsByCreatorIdOrUserId(authenticatedUser.getUserId());
    }

    @Override
    public List<String> listTraineeWithMyTrainingPlans(long userId){

        return trainingPlanRepository.findDistinctUsernamesByCreatorIdOrUserId(userId);
    }

    @Override
    public List<String> listTraineeWithMyTrainingPlans(){
        return trainingPlanRepository.findDistinctUsernamesByCreatorIdOrUserId(authenticatedUser.getUserId());
    }


    @Override
    @Transactional
    public TrainingPlan getViewSingleOnlyCreatorId(long id) {

        long userId = authenticatedUser.getUserId();

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorId(id,userId);

        return trainingPlan.orElse(null);

    }

    @Override
    @Transactional
    public long newPlanForYourself(TrainingPlanDto trainingPlanDto) {

        TrainingPlan trainingPlan = new TrainingPlan();
        trainingPlan.setCreatorId(authenticatedUser.getUserId());
        trainingPlan.setName(trainingPlanDto.getName());
        Set<User> users = new HashSet<>();
        users.add(userUseCase.findById(authenticatedUser.getUserId()));
        trainingPlan.setUsers(users);
        trainingPlan.setTemplate(trainingPlanDto.getTemplate());
        trainingPlanRepository.save(trainingPlan);

        return trainingPlan.getId();

    }


    @Override
    public TrainingPlan getViewSingle(long id) throws Exception {

        long userId = authenticatedUser.getUserId();

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(id,userId,userId);

        if (trainingPlan.isPresent()) {

            if (trainingPlan.get().getCreatorId() == 1L) {
                accessToPaidPlansCheckPort.accessToPaidPlan();
            }

            return trainingPlan.orElse(null);

        }

        return null;

    }

    @Override
    public TrainingPlanSummaryDto getTrainingPlanSummary(long id) throws Exception{

        TrainingPlan trainingPlan = getViewSingleForAi(id);

        if (trainingPlan == null) {throw new Exception("No training plan found");}

        return trainingPlanDomainService.toSummaryDto(trainingPlan);

    }

    public TrainingPlan getViewSingleForAi(long id) {

        long userId = authenticatedUser.getUserId();

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(id,userId,userId);

        return trainingPlan.orElse(null);

    }

    @Override
    public List<TrainingPlan> getAllPlans() {

        long userId = authenticatedUser.getUserId();

        Optional<List<TrainingPlan>> trainingPlanList = trainingPlanRepository.findByCreatorIdOrUserId(userId,userId);

        return trainingPlanList.orElse(null);

    }

    @Override
    public long newPlanForUser(String email,TrainingPlanDto trainingPlanDto) {

        TrainingPlan trainingPlan = new TrainingPlan();
        trainingPlan.setCreatorId(authenticatedUser.getUserId());
        trainingPlan.setName(trainingPlanDto.getName());
        trainingPlan.setUsers(userUseCase.findByUserName(email));
        trainingPlan.setTemplate(false);

        trainingPlanRepository.save(trainingPlan);

        notificationPort.newPlanCreated(email);

        return trainingPlan.getId();
    }

    @Override
    public long sumPlans() {

        return trainingPlanRepository.countByCreatorIdOrUserId(authenticatedUser.getUserId());

    }


    @Override
    public long myPlans() {

        return trainingPlanRepository.countTrainingPlanByUserIdWithoutSchema(authenticatedUser.getUserId());

    }


    @Override
    public boolean delete(long id) {

        long userid = authenticatedUser.getUserId();

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(id,userid,userid);

        if(trainingPlan.isPresent()) {

            trainingPlanRepository.deleteById(id);

            return true;
        }

        return false;
    }


    @Override
    public List<TrainingPlanViewTemplateDto> myTemplateView() throws Exception {


        Optional<List<TrainingPlan>> trainingPlans = trainingPlanRepository.findTemplatesByCreatorId(authenticatedUser.getUserId());
        if (trainingPlans.isEmpty()){throw new Exception("Training Plans Empty");}

            return trainingPlans.get().stream()
                    .map(plan -> {
                        TrainingPlanViewTemplateDto dto = new TrainingPlanViewTemplateDto();
                        dto.setName(plan.getName());
                        dto.setTrainingDays(plan.getWeeks().stream().findFirst().get().getDays().size());
                        dto.setId(plan.getId());
                        return dto;
                    })
                    .collect(Collectors.toList());

    }


    @Override
    public Optional<Long> userInTrainingPlan(long id) {

        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorIdOrUserId(id,authenticatedUser.getUserId(),authenticatedUser.getUserId());

        return trainingPlan.map(plan -> plan.getUsers().stream().findFirst().map(User::getId).orElse(0L));
    }


    @Override
    public List<TrainingPlanSimpleViewDto> getAllPlansSimpleDto() {

        long userId = authenticatedUser.getUserId();

        Optional<List<TrainingPlan>> trainingPlanList = trainingPlanRepository.findByCreatorIdOrUserId(userId,userId);

        return trainingPlanList.orElse(Collections.emptyList())
                .stream()
                .map(trainingPlanSimpleViewDtoMapper::convertToSimpleDto)
                .collect(Collectors.toList());
    }


    @Override
    public Long sumSchema() throws Exception{

        if (!authenticatedUser.getUserRole().equals("ROLE_TRAINER")){
           throw new Exception("Only for Trainer");
        }
        return trainingPlanRepository.countSchemaByTrainerId(authenticatedUser.getUserId());

    }

    @Override
    public Long sumPlanToCheck() {

        return trainingPlanRepository.countPlanToCheck(authenticatedUser.getUserId());

    }


    @Override
    public void setPlanToChecked(long id) throws Exception {


        Optional<TrainingPlan> trainingPlan = trainingPlanRepository.findByIdAndCreatorId(id, authenticatedUser.getUserId());

        if (trainingPlan.isEmpty()){throw new Exception("Training Plan not Found");}

            trainingPlan.get().setChecked(true);

            trainingPlanRepository.save(trainingPlan.get());


    }


    @Override
    public TrainingPlanDtoWithDate getNearestDay() throws Exception {

        try {

            Optional<List<TrainingPlan>> trainingPlanListOptional = trainingPlanRepository.findFirstByClosestUnfinishedTrainingPlanForUser(authenticatedUser.getUserId());

            if (trainingPlanListOptional.isEmpty() || trainingPlanListOptional.get().isEmpty()) {
                throw new NoSuchElementException("No training plans found for the user.");
            }

            TrainingPlan closestTrainingPlan = trainingPlanListOptional.get().stream()
                    .findFirst()
                    .orElseThrow(() -> new NoSuchElementException("No training plans found for the user."));

            return trainingPlanDomainService.getNearestPlannedTrainingDay(closestTrainingPlan);

        } catch (NoSuchElementException e){

            throw new Exception(e.getMessage());

        }

    }

    @Override
    public TrainingPlan saveTrainingPlan(TrainingPlan trainingPlan) {

       return trainingPlanRepository.save(trainingPlan);

    }


}
