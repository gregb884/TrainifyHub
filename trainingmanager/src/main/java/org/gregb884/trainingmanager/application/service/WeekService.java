package org.gregb884.trainingmanager.application.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.dto.WeekDto;
import org.gregb884.trainingmanager.application.port.in.DayUseCase;
import org.gregb884.trainingmanager.application.port.in.TrainingPlanUseCase;
import org.gregb884.trainingmanager.application.port.in.UserUseCase;
import org.gregb884.trainingmanager.application.port.in.WeekUseCase;
import org.gregb884.trainingmanager.application.port.out.AccessToPaidPlansCheckPort;
import org.gregb884.trainingmanager.application.port.out.NotificationPort;
import org.gregb884.trainingmanager.domain.model.Week;
import org.gregb884.trainingmanager.domain.repository.WeekRepositoryPort;
import org.gregb884.trainingmanager.domain.service.DateHelper;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WeekService implements WeekUseCase {


    private final WeekRepositoryPort weekRepository;
    private final AccessToPaidPlansCheckPort accessToPaidPlansCheckPort;
    private final AuthenticatedUser authenticatedUser;
    private final DateHelper dateHelper = new DateHelper();
    private final NotificationPort notificationPort;
    private final UserUseCase userUseCase;
    private final TrainingPlanUseCase trainingPlanUseCase;
    private final DuplicateEntityService duplicateEntityService;

    @PersistenceContext
    private EntityManager entityManager;


    @Override
    @Transactional
    public long createNew(long planId, WeekDto weekDto) {

        Week newWeek = new Week();
        newWeek.setDone(false);
        newWeek.setStartDate(weekDto.getStartDate());
        newWeek.setEndDate(weekDto.getEndDate());
        newWeek.setTrainingPlan(trainingPlanUseCase.getViewSingleOnlyCreatorId(planId));
        newWeek.setCreatorId(newWeek.getTrainingPlan().getCreatorId());
        weekRepository.save(newWeek);
        return newWeek.getId();
    }


    @Override
    public Optional<Week> getWithAccessControl(long id) throws Exception {

        Optional<Week> optionalWeek = weekRepository.findByIdAndUserId(id, authenticatedUser.getUserId());

        if (optionalWeek.isPresent() && optionalWeek.get().getCreatorId() == 1) {

            boolean access =  accessToPaidPlansCheckPort.accessToPaidPlan();

            if (access) {
                return optionalWeek;
            }
        }
        return optionalWeek;
    }

    @Override
    public Optional<Week> get(long id) {

        return weekRepository.findByIdAndUserId(id, authenticatedUser.getUserId());

    }

    @Override
    public boolean deleteWeek(long id) {

        Optional<Week> week = weekRepository.findByIdAndUserId(id, authenticatedUser.getUserId());

        if (week.isPresent()) {

            weekRepository.delete(week.get());
            return true;
        }

        return false;

    }


    @Override
    public boolean edit(long id, Week week) {

        Optional<Week> weekToEdit = weekRepository.findByIdAndOnlyCreatorId(id, authenticatedUser.getUserId());

        if (weekToEdit.isPresent()) {

            weekToEdit.get().setStartDate(week.getStartDate());
            weekToEdit.get().setEndDate(week.getEndDate());
            weekRepository.save(weekToEdit.get());

            return true;
        }

        return false;

    }

    public boolean isCreatedByTrainerForUser(long id) {

        return id != authenticatedUser.getUserId() && id != 1L && id != 2L;

    }


    @Override
    public void setDone(long id) throws Exception {

        Optional<Week> week = weekRepository.findByIdAndUserId(id, authenticatedUser.getUserId());

        if (week.isEmpty()) throw new Exception("Week not found");

        if (week.get().isFullyDone()) {

            week.get().setDone(true);

            weekRepository.save(week.get());

            if (isCreatedByTrainerForUser(week.get().getCreatorId())){
                notificationPort.traineeDoneWeek(dateHelper.weekNumber(week.get().getStartDate()), userUseCase.getTrainerEmailById(week.get().getCreatorId()));


                if (week.get().getTrainingPlan().isFullyDone()){

                    trainingPlanUseCase.setToCheck(week.get().getTrainingPlan());
                    notificationPort.traineeDoneTrainingPlan(week.get().getTrainingPlan().getName(),userUseCase.getTrainerEmailById(week.get().getCreatorId()));

                }
            }

        }
    }


    @Override
    public boolean cloneWeek(long weekId, WeekDto weekDto) throws Exception{

        return duplicateEntityService.duplicateWeek(weekId,weekDto,false);

    }






}
