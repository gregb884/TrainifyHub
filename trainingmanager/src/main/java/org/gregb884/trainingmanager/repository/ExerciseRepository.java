package org.gregb884.trainingmanager.repository;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.dto.ExerciseDtoOnlyEnName;
import org.gregb884.trainingmanager.model.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Transactional
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    Page<Exercise> findAll(Pageable pageable);


    @Query("SELECT e FROM Exercise e WHERE " +
            "(:search IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (e.isPrivate = false OR e.creatorId = :creatorId)")
    Page<Exercise> findByIsPrivateFalseOrCreatorId(@Param("creatorId") Long creatorId, @Param("search") String search, Pageable pageable);

    @Query("SELECT e FROM Exercise e WHERE " +
            "(:search IS NULL OR LOWER(e.namePl) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.descriptionPl) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (e.isPrivate = false OR e.creatorId = :creatorId)")
    Page<Exercise> findByIsPrivateFalseOrCreatorIdPl(@Param("creatorId") Long creatorId, @Param("search") String search, Pageable pageable);

    @Query("SELECT e FROM Exercise e WHERE " +
            "(:search IS NULL OR LOWER(e.nameDe) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.descriptionDe) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (e.isPrivate = false OR e.creatorId = :creatorId)")
    Page<Exercise> findByIsPrivateFalseOrCreatorIdDe(@Param("creatorId") Long creatorId, @Param("search") String search, Pageable pageable);


    @Query("SELECT e FROM Exercise e WHERE e.id = :id AND (e.isPrivate = false OR e.creatorId = :creatorId)")
    Optional<Exercise> findByIdAndIsPrivateFalseOrCreatorId(@Param("id") Long id, @Param("creatorId") Long creatorId);

    @Query("SELECT e FROM Exercise e WHERE e.id IN :ids AND (e.isPrivate = false OR e.creatorId = :creatorId)")
    Optional<List<Exercise>> findByIdListAndIsPrivateFalseOrCreatorId(@Param("ids") List<Long> ids, @Param("creatorId") Long creatorId);

    @Query("SELECT e FROM Exercise e WHERE e.id = :id AND (e.creatorId = :creatorId)")
    Optional<Exercise> findByIdAccessOnlyCreatorId(@Param("id") Long id, @Param("creatorId") Long creatorId);

    @Query("SELECT new org.gregb884.trainingmanager.dto.ExerciseDtoOnlyEnName(e.name) FROM Exercise e WHERE (e.isPrivate = false OR e.creatorId = :creatorId) AND LOWER(e.mainMuscle) IN (:mainMuscles)")
    List<ExerciseDtoOnlyEnName> findByMainMuscleInAndIsPrivateFalseOrCreatorId(@Param("mainMuscles") List<String> mainMuscles, @Param("creatorId") Long creatorId);


}
