package org.gregb884.profilemanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.domain.model.Trainer;
import org.gregb884.profilemanager.domain.repository.TrainerRepositoryPort;
import org.gregb884.profilemanager.infrastructure.adapter.out.persistence.jparepository.TrainerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TrainerRepositoryAdapter implements TrainerRepositoryPort {

    private final TrainerRepository trainerRepository;


    @Override
    public boolean existsUserByUsername(String username) {
        return trainerRepository.existsUserByUsername(username);
    }

    @Override
    public Page<Trainer> findAllByIsPublic(String search, Pageable pageable, String region) {
        return trainerRepository.findAllByIsPublic(search, pageable, region);
    }

    @Override
    public Optional<Trainer> findByIdAndIsPublicTrue(Long id) {
        return trainerRepository.findByIdAndIsPublicTrue(id);
    }

    @Override
    public Optional<Trainer> findByUsername(String username) {
        return trainerRepository.findByUsername(username);
    }

    @Override
    public void save(Trainer trainer1) {
        trainerRepository.save(trainer1);
    }

    @Override
    public Optional<Trainer> findById(Long userId) {
        return trainerRepository.findById(userId);
    }

    @Override
    public void delete(Trainer trainer) {
        trainerRepository.delete(trainer);
    }

}
