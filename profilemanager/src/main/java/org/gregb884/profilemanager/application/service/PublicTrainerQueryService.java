package org.gregb884.profilemanager.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.dto.TrainerDto;
import org.gregb884.profilemanager.application.mapper.TrainerDtoMapper;
import org.gregb884.profilemanager.application.port.in.PublicQueryTrainerUseCase;
import org.gregb884.profilemanager.domain.model.Trainer;
import org.gregb884.profilemanager.domain.repository.TrainerRepositoryPort;
import org.gregb884.profilemanager.infrastructure.security.AuthenticatedUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PublicTrainerQueryService implements PublicQueryTrainerUseCase {


    private final TrainerRepositoryPort trainerRepository;
    private final TrainerDtoMapper trainerDtoMapper;
    private final AuthenticatedUser authenticatedUser;


    @Override
    public Optional<Trainer> getTrainerByUserName(String userName) {

        return trainerRepository.findByUsername(userName);

    }

    @Override
    public Trainer getTrainer(long id) {

        Optional<Trainer> trainer = trainerRepository.findByIdAndIsPublicTrue(id);
        return trainer.orElse(null);
    }

    @Override
    public TrainerDto getTrainerProfile(long id) {

        Optional<Trainer> trainer = trainerRepository.findByIdAndIsPublicTrue(id);

        return trainer.map(trainerDtoMapper::toDto).orElse(null);

    }

    @Override
    public Page<TrainerDto> getAllPublicTrainer(int page, int size, String search) {


        String searchToLowerCase = search.toLowerCase();

        Pageable pageable = PageRequest.of(page, size);

        Page<Trainer> trainerPage = trainerRepository.findAllByIsPublic(searchToLowerCase,pageable, authenticatedUser.getLang());

        return trainerPage.map(trainerDtoMapper::toDto);

    }


}
