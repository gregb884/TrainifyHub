package org.gregb884.profilemanager.application.port.in;

import org.gregb884.profilemanager.application.dto.TrainerDto;
import org.gregb884.profilemanager.domain.model.Trainer;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface PublicQueryTrainerUseCase {


    Optional<Trainer> getTrainerByUserName(String userName);
    public Trainer getTrainer(long id);
    TrainerDto getTrainerProfile(long id);
    Page<TrainerDto> getAllPublicTrainer(int page, int size, String search);

}
