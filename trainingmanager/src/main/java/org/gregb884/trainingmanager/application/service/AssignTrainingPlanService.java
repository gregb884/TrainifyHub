package org.gregb884.trainingmanager.application.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.AssignPlanDto;
import org.gregb884.trainingmanager.application.mapper.TrainingPlanMapper;
import org.gregb884.trainingmanager.application.port.in.AssignTrainingPlanUseCase;
import org.gregb884.trainingmanager.application.port.in.UserUseCase;
import org.gregb884.trainingmanager.application.port.out.AccessToPaidPlansCheckPort;
import org.gregb884.trainingmanager.domain.model.*;
import org.gregb884.trainingmanager.domain.repository.TrainingPlanRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;

@Service
@AllArgsConstructor
public class AssignTrainingPlanService implements AssignTrainingPlanUseCase {


    private final AccessToPaidPlansCheckPort accessToPaidPlansCheckPort;
    private final TrainingPlanRepositoryPort trainingPlanRepository;
    private final AuthenticatedUser authenticatedUser;
    private final TrainingPlanMapper trainingPlanMapper;
    private final UserUseCase userUseCase;


    @Override
    @Transactional
    public Long assignPlan(long planId, String userEmail, AssignPlanDto assignPlanDto, boolean paidPlans) throws Exception {


        if (paidPlans){
            accessToPaidPlansCheckPort.accessToPaidPlan();
        }

        Date startDateFromDtoDate = assignPlanDto.getStartDate();
        LocalDate startDateFromDtoLocal = startDateFromDtoDate.toInstant().atZone(ZoneOffset.UTC).toLocalDate();

        if (!startDateFromDtoLocal.getDayOfWeek().equals(DayOfWeek.MONDAY)){
            throw new Exception("Only from MONDAY dates are supported");
        }

        TrainingPlan trainingPlanOptional = new TrainingPlan();

        if (paidPlans)
        { trainingPlanOptional = trainingPlanRepository.findByIdAndCreatorId(planId,1L).orElse(null);}
        else
        { trainingPlanOptional = trainingPlanRepository.findByIdAndCreatorId(planId, authenticatedUser.getUserId()).orElse(null);}


            TrainingPlan originalPlan = trainingPlanOptional;

        if (originalPlan == null) {throw new Exception("Training plan not found");}

        Optional<Week> firstWeek = originalPlan.getWeeks().stream().findFirst();

        if (firstWeek.isEmpty() || firstWeek.get().getDays().size() != assignPlanDto.getWeekDay().size()) {
            throw new Exception("Select correct quantity days");
        }

            // Clone the plan training
            TrainingPlan clonedPlan = trainingPlanMapper.clonePlan(originalPlan);

            clonedPlan.setUsers(userUseCase.findByUserName(userEmail));

            // Save the cloned plan first, without relationships
            TrainingPlan savedClonedPlan = trainingPlanRepository.save(clonedPlan);

            // Convert startDate from Date to LocalDate
            Date startDateOld = assignPlanDto.getStartDate();
            LocalDate startDate = startDateOld.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
            startDate = startDate.minusDays(7);

            // Clone weeks and their related entities
            Set<Week> clonedWeeks = new HashSet<>();
            for (Week originalWeek : originalPlan.getWeeks()) {
                Week clonedWeek = trainingPlanMapper.cloneWeek(originalWeek);
                clonedWeek.setTrainingPlan(savedClonedPlan); // Set the newly saved plan

                // Set start and end dates for the week
                startDate = startDate.plusDays(7);
                clonedWeek.setStartDate(Date.from(startDate.atStartOfDay(ZoneOffset.UTC).toInstant()));

                LocalDate endDate = startDate.plusDays(6);
                clonedWeek.setEndDate(Date.from(endDate.atStartOfDay(ZoneOffset.UTC).toInstant()));

                // Clone days
                Set<Day> clonedDays = new HashSet<>();
                List<Integer> dayList = new ArrayList<>(assignPlanDto.getWeekDay());
                int dayIndex = 0;

                for (Day originalDay : originalWeek.getDays()) {
                    Day clonedDay = trainingPlanMapper.cloneDay(originalDay);
                    clonedDay.setWeek(clonedWeek); // Set the cloned week

                    // Set planned date for the day
                    LocalDate dayDate = startDate.plusDays(dayList.get(dayIndex));
                    clonedDay.setPlannedDate(Date.from(dayDate.atStartOfDay(ZoneOffset.UTC).toInstant()));
                    dayIndex++;

                    // Clone exercise plans
                    Set<ExercisePlan> clonedExercisePlans = new HashSet<>();
                    for (ExercisePlan originalExercisePlan : originalDay.getExercisePlans()) {
                        ExercisePlan clonedExercisePlan = trainingPlanMapper.cloneExercisePlan(originalExercisePlan);
                        clonedExercisePlan.setDay(clonedDay); // Set the cloned day

                        // Clone exercise series
                        Set<ExerciseSeries> clonedExerciseSeriesSet = new HashSet<>();
                        for (ExerciseSeries originalSeries : originalExercisePlan.getExerciseSeries()) {
                            ExerciseSeries clonedSeries = trainingPlanMapper.cloneExerciseSeries(originalSeries);
                            clonedSeries.setExercisePlan(clonedExercisePlan); // Set the cloned exercise plan

                            clonedExerciseSeriesSet.add(clonedSeries);
                        }

                        // Assign the cloned exercise series to the cloned exercise plan
                        clonedExercisePlan.setExerciseSeries(clonedExerciseSeriesSet);

                        // Add the cloned exercise plan to the set
                        clonedExercisePlans.add(clonedExercisePlan);
                    }

                    // Assign the cloned exercise plans to the cloned day
                    clonedDay.setExercisePlans(clonedExercisePlans);

                    // Add the cloned day to the set
                    clonedDays.add(clonedDay);
                }

                // Assign the cloned days to the cloned week
                clonedWeek.setDays(clonedDays);

                // Add the cloned week to the set
                clonedWeeks.add(clonedWeek);
            }

            // Assign the cloned weeks to the cloned training plan
            savedClonedPlan.setWeeks(clonedWeeks);

            savedClonedPlan.setTemplate(false);

            // Save the entire structure again with relationships now
            trainingPlanRepository.save(savedClonedPlan);

            return savedClonedPlan.getId();

    }

}
