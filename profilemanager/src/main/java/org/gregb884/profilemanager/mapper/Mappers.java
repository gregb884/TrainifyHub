package org.gregb884.profilemanager.mapper;

import org.gregb884.profilemanager.dto.RequestDto;
import org.gregb884.profilemanager.dto.TrainerDto;
import org.gregb884.profilemanager.dto.UserDto;
import org.gregb884.profilemanager.model.Request;
import org.gregb884.profilemanager.model.Trainer;
import org.gregb884.profilemanager.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class Mappers {


    public static Trainer toTrainer(TrainerDto trainerDto, long id, boolean isPublic) {

        Trainer trainer = new Trainer();
        trainer.setId(id);
        trainer.setUsername(trainerDto.getUsername());
        trainer.setFirstName(trainerDto.getFirstName());
        trainer.setLastName(trainerDto.getLastName());
        trainer.setRegion(trainerDto.getRegion());
        trainer.setDescription(trainerDto.getDescription());
        trainer.setProfessionalExperience(trainerDto.getProfessionalExperience());
        trainer.setTrainingExperience(trainerDto.getTrainingExperience());
        trainer.setTrainingPlanPriceIncludes(trainerDto.getTrainingPlanPriceIncludes());
        trainer.setCity(trainerDto.getCity());
        trainer.setClub(trainerDto.getClub());
        trainer.setEmail(trainerDto.getEmail());
        trainer.setPhone(trainerDto.getPhone());
        trainer.setInstagram(trainerDto.getInstagram());
        trainer.setPriceFrom(trainerDto.getPriceFrom());
        trainer.setPriceTo(trainerDto.getPriceTo());
        trainer.setWhatDoesTheCooperationLookLike(trainerDto.getWhatDoesTheCooperationLookLike());
        trainer.setSpecialization(trainerDto.getSpecialization());
        trainer.setHistory(trainerDto.getHistory());
        trainer.setImageUrl(trainerDto.getImageUrl());
        trainer.setIsPublic(isPublic);

        return trainer;
    }

    public static TrainerDto toTrainerDto(Trainer trainer) {

        TrainerDto trainerDto = new TrainerDto();
        trainerDto.setId(trainer.getId());
        trainerDto.setUsername(trainer.getUsername());
        trainerDto.setFirstName(trainer.getFirstName());
        trainerDto.setLastName(trainer.getLastName());
        trainer.setRegion(trainer.getRegion());
        trainerDto.setDescription(trainer.getDescription());
        trainerDto.setProfessionalExperience(trainer.getProfessionalExperience());
        trainerDto.setTrainingExperience(trainer.getTrainingExperience());
        trainerDto.setTrainingPlanPriceIncludes(trainer.getTrainingPlanPriceIncludes());
        trainerDto.setCity(trainer.getCity());
        trainerDto.setClub(trainer.getClub());
        trainerDto.setEmail(trainer.getEmail());
        trainerDto.setPhone(trainer.getPhone());
        trainerDto.setInstagram(trainer.getInstagram());
        trainerDto.setPriceFrom(trainer.getPriceFrom());
        trainerDto.setPriceTo(trainer.getPriceTo());
        trainerDto.setWhatDoesTheCooperationLookLike(trainer.getWhatDoesTheCooperationLookLike());
        trainerDto.setSpecialization(trainer.getSpecialization());
        trainerDto.setHistory(trainer.getHistory());
        trainerDto.setImageUrl(trainer.getImageUrl());

        return trainerDto;
    }

    public static User toUser(UserDto userDto, long id) {

        User user = new User();
        user.setId(id);
        user.setUsername(userDto.getUsername());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setRegion(userDto.getRegion());
        user.setImageUrl(userDto.getImageUrl());
        user.setFitnessGoal(userDto.getFitnessGoal());
        user.setTrainerPreferences(userDto.getTrainerPreferences());
        user.setTrainingFrequency(userDto.getTrainingFrequency());
        user.setTrainingLocation(userDto.getTrainingLocation());
        user.setHeight(userDto.getHeight());
        user.setWeight(userDto.getWeight());
        user.setMedicalHistory(userDto.getMedicalHistory());
        user.setCurrentIssues(userDto.getCurrentIssues());
        user.setDietaryRestrictions(userDto.getDietaryRestrictions());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setEmail(userDto.getEmail());
        user.setPlanType(userDto.getPlanType());
        user.setTrainingPreferences(userDto.getTrainingPreferences());
        user.setCity(userDto.getCity());
        user.setAvailability(userDto.getAvailability());
        user.setTargetWeight(userDto.getTargetWeight());
        user.setTargetBodyFatPercentage(userDto.getTargetBodyFatPercentage());
        user.setFitnessLevel(userDto.getFitnessLevel());
        user.setChestCircumference(userDto.getChestCircumference());
        user.setWaistCircumference(userDto.getWaistCircumference());
        user.setHipCircumference(userDto.getHipCircumference());
        user.setArmCircumference(userDto.getArmCircumference());
        user.setThighCircumference(userDto.getThighCircumference());
        user.setCalfCircumference(userDto.getCalfCircumference());

        return user;


    }


    public static RequestDto toRequestDto(Request request) {

        RequestDto requestDto = new RequestDto();
        requestDto.setId(request.getId());
        requestDto.setAccepted(request.isAccepted());
        requestDto.setTrainerId(request.getTrainer().getId());
        requestDto.setUser(request.getUser());
        requestDto.setTrainerFirstName(request.getTrainer().getFirstName());
        requestDto.setTrainerLastName(request.getTrainer().getLastName());

        return requestDto;
    }

    public static List<RequestDto> toRequestDtoList(List<Request> requests) {

        return requests.stream()
                .map(Mappers::toRequestDto)
                .collect(Collectors.toList());
    }




}
