package org.gregb884.profilemanager.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.dto.TrainerDto;
import org.gregb884.profilemanager.application.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.application.mapper.CreateTrainerFromDtoMapper;
import org.gregb884.profilemanager.application.mapper.EditTrainerProfileMapper;
import org.gregb884.profilemanager.application.port.in.TrainerProfileUseCase;
import org.gregb884.profilemanager.domain.model.Trainer;
import org.gregb884.profilemanager.domain.repository.TrainerRepositoryPort;
import org.gregb884.profilemanager.infrastructure.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class TrainerProfileService implements TrainerProfileUseCase {

    private final TrainerRepositoryPort trainerRepository;
    private final CreateTrainerFromDtoMapper mapperForCreateTrainer;
    private final AuthenticatedUser authenticatedUser;
    private final EditTrainerProfileMapper editTrainerProfileMapper;

    @Override
    public boolean saveNewUser(UserAndTrainerDtoForCreate userAndTrainerDtoForCreate) {

        if (trainerRepository.existsUserByUsername(userAndTrainerDtoForCreate.getUsername())) {
            return false;
        }

        Trainer trainer1 = mapperForCreateTrainer.toDomain(userAndTrainerDtoForCreate);
        trainer1.setIsPublic(false);

        trainerRepository.save(trainer1);

        return true;

    }

    @Override
    public void setNewImageUrl(String userImageUrl) {

        Optional<Trainer> trainer = trainerRepository.findByUsername(authenticatedUser.getEmail());

        if (trainer.isPresent()) {
            trainer.get().setImageUrl(userImageUrl);
            trainerRepository.save(trainer.get());
        }
    }

    @Override
    public Optional<Trainer> getMyProfileTrainer() {

        return trainerRepository.findById(authenticatedUser.getUserId());

    }

    @Override
    public void editMyProfile(TrainerDto trainerDto) throws Exception {

        Optional<Trainer> user = trainerRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {

            Trainer trainer = editTrainerProfileMapper.toDomain(trainerDto);
            trainer.setId(user.get().getId());
            trainer.setIsPublic(user.get().isIsPublic());
            trainerRepository.save(trainer);
        }

        else throw new Exception("User not found");

    }

    @Override
    public Boolean changePublicProfile() {

        Optional<Trainer> user = trainerRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {

            if (user.get().isIsPublic()){

                user.get().setIsPublic(false);
                trainerRepository.save(user.get());

                return false;
            }

            user.get().setIsPublic(true);
            trainerRepository.save(user.get());

            return true;

        }

        return false;
    }

    @Override
    public boolean deleteTrainer() {

        Optional<Trainer> trainer = trainerRepository.findById(authenticatedUser.getUserId());

        if (trainer.isPresent()) {

            trainerRepository.delete(trainer.get());

            return true;
        }

        return false;
    }


}
