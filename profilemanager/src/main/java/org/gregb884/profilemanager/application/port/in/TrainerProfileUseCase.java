package org.gregb884.profilemanager.application.port.in;

import org.gregb884.profilemanager.application.dto.TrainerDto;
import org.gregb884.profilemanager.application.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.domain.model.Trainer;

import java.util.Optional;

public interface TrainerProfileUseCase {

    Optional<Trainer> getMyProfileTrainer();

    void setNewImageUrl(String userImageUrl);

    boolean saveNewUser(UserAndTrainerDtoForCreate userAndTrainerDtoForCreate);

    void editMyProfile(TrainerDto trainerDto) throws Exception;

    Boolean changePublicProfile();

    boolean deleteTrainer();
}
