package org.gregb884.trainingmanager.domain.repository;

import org.gregb884.trainingmanager.domain.dto.ExerciseDtoOnlyEnName;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ExerciseRepositoryPort {

    Page<Exercise> findAll(Pageable pageable);

    List<Exercise> findAll();

    Page<Exercise> findByIsPrivateFalseOrCreatorId(Long creatorId, String search, Pageable pageable);

    Page<Exercise> findByIsPrivateFalseOrCreatorIdPl(Long creatorId, String search, Pageable pageable);

    Page<Exercise> findByIsPrivateFalseOrCreatorIdDe(Long creatorId, String search, Pageable pageable);

    Optional<Exercise> findByIdAndIsPrivateFalseOrCreatorId(Long id, Long creatorId);

    Optional<List<Exercise>> findByIdListAndIsPrivateFalseOrCreatorId(List<Long> ids, Long creatorId);

    Optional<Exercise> findByIdAccessOnlyCreatorId(Long id, Long creatorId);

    List<ExerciseDtoOnlyEnName> findByMainMuscleInAndIsPrivateFalseOrCreatorId(List<String> mainMuscles, Long creatorId);


    void save(Exercise exercise);

    void delete(Exercise exercise);
}
