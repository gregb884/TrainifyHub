package org.gregb884.statistic.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.application.dto.ExerciseNameDto;
import org.gregb884.statistic.application.dto.UserDtoHighlights;
import org.gregb884.statistic.application.mapper.UserHighlightsMapper;
import org.gregb884.statistic.application.port.in.ExerciseStatisticUseCase;
import org.gregb884.statistic.application.port.in.UserHighlightsUseCase;
import org.gregb884.statistic.application.port.in.UserUseCase;
import org.gregb884.statistic.domain.model.User;
import org.gregb884.statistic.domain.repository.UserRepositoryPort;
import org.gregb884.statistic.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserHighLightsService implements UserHighlightsUseCase {

    private final UserRepositoryPort userRepository;
    private final AuthenticatedUser authenticatedUser;
    private final UserHighlightsMapper userHighlightsMapper;
    private final UserUseCase userUseCase;


    @Override
    public void setUserRegress(ExerciseNameDto exerciseNameDto){

        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {

            String userLang = authenticatedUser.getLang();

            switch (userLang) {
                case "en": user.get().setRegress(exerciseNameDto.getName());
                break;
                case "pl": user.get().setRegress(exerciseNameDto.getNamePl());
                break;
                case "de": user.get().setRegress(exerciseNameDto.getNameDe());
                break;
            }

            userRepository.save(user.get());
        }

    }

    @Override
    public void setUserProgress(ExerciseNameDto exerciseNameDto){


        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {

            String userLang = authenticatedUser.getLang();

            switch (userLang) {
                case "en": user.get().setProgress(exerciseNameDto.getName());
                break;
                case "pl": user.get().setProgress(exerciseNameDto.getNamePl());
                break;
                case "de": user.get().setProgress(exerciseNameDto.getNameDe());
                break;
            }

            userRepository.save(user.get());

        }

    }

    @Override
    public void setUser1Rm(ExerciseNameDto exerciseNameDto){

        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {

            String userLang = authenticatedUser.getLang();

            switch (userLang){
                case "en": user.get().setRmProgress(exerciseNameDto.getName());
                break;
                case "pl": user.get().setRmProgress(exerciseNameDto.getNamePl());
                break;
                case "de": user.get().setRmProgress(exerciseNameDto.getNameDe());
                break;
            }

            userRepository.save(user.get());
        }

    }


    @Override
    public void setUserNewExercise(ExerciseNameDto exerciseNameDto){

        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {

            String userLang = authenticatedUser.getLang();

            switch (userLang){
                case "en": user.get().setExerciseNew(exerciseNameDto.getName());
                break;
                case "pl": user.get().setExerciseNew(exerciseNameDto.getNamePl());
                break;
                case "de": user.get().setExerciseNew(exerciseNameDto.getNameDe());
                break;
            }

            userRepository.save(user.get());

        }

    }


    @Override
    public UserDtoHighlights getHighlights(){

        return userHighlightsMapper.toDto(userUseCase.getUser(authenticatedUser.getUserId()));

    }




}
