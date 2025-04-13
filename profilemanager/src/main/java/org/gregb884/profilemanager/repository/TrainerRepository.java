package org.gregb884.profilemanager.repository;

import org.gregb884.profilemanager.model.Trainer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {


    boolean existsUserByUsername(String username);

    @Query("SELECT t FROM Trainer t WHERE " +
            "(:search IS NULL OR LOWER(t.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR :search IS NULL OR LOWER(t.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR :search IS NULL OR LOWER(t.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR :search IS NULL OR LOWER(t.city) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND t.IsPublic = true " +
            "AND t.region = :region")
    Page<Trainer> findAllByIsPublic(@Param("search") String search, Pageable pageable, @Param("region") String region);


    @Query("SELECT t FROM Trainer t WHERE t.id = :id AND t.IsPublic = true")
    Optional<Trainer> findByIdAndIsPublicTrue(@Param("id") Long id);


    Optional<Trainer> findByUsername(String username);


}
