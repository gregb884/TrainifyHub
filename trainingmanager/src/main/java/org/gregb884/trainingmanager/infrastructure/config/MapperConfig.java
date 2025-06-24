package org.gregb884.trainingmanager.infrastructure.config;

import org.gregb884.trainingmanager.application.mapper.ExerciseDtoForCreateMapper;
import org.gregb884.trainingmanager.application.mapper.ExerciseDtoMapperDecorator;
import org.gregb884.trainingmanager.infrastructure.security.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class MapperConfig {

    @Bean
    @Primary
    public ExerciseDtoForCreateMapper exerciseDtoForCreateMapper(
            @Qualifier("exerciseDtoForCreateMapperImpl") ExerciseDtoForCreateMapper delegate,
            AuthenticatedUser authenticatedUser) {
        return new ExerciseDtoMapperDecorator(delegate, authenticatedUser);
    }
}