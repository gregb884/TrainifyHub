package org.gregb884.trainingmanager.infrastructure.config;

import org.gregb884.trainingmanager.domain.service.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

    @Configuration
    public class DomainConfig {

        @Bean
        public ExerciseSeriesDomainService exerciseSeriesDomainService() {
            return new ExerciseSeriesDomainService();
        }

        @Bean
        public ExercisePlanFactory exercisePlanFactory(ExerciseSeriesDomainService seriesDomainService) {
            return new ExercisePlanFactory(seriesDomainService);
        }

        @Bean
        public DayFactory dayFactory(ExercisePlanFactory exercisePlanFactory) {
            return new DayFactory(exercisePlanFactory);
        }

        @Bean
        public WeekFactory weekFactory(DayFactory dayFactory) {
            return new WeekFactory(dayFactory);
        }

        @Bean
        public TrainingPlanDomainService trainingPlanDomainService(WeekFactory weekFactory) {
            return new TrainingPlanDomainService(weekFactory);
        }
    }
