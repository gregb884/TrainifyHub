package org.gregb884.profilemanager.domain.repository;

import org.gregb884.profilemanager.domain.model.Trainer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.Optional;


public interface TrainerRepositoryPort {


    boolean existsUserByUsername(String username);

    Page<Trainer> findAllByIsPublic(String search, Pageable pageable, String region);

    Optional<Trainer> findByIdAndIsPublicTrue(Long id);


    Optional<Trainer> findByUsername(String username);


    void save(Trainer trainer1);

    Optional<Trainer> findById(Long userId);

    void delete(Trainer trainer);
}
