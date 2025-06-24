package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.domain.dto.ExerciseDtoOnlyEnName;
import org.gregb884.trainingmanager.domain.model.Exercise;
import org.gregb884.trainingmanager.domain.repository.ExerciseRepositoryPort;
import org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository.ExerciseJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ExerciseRepositoryAdapter implements ExerciseRepositoryPort {

    private final ExerciseJpaRepository exerciseJpaRepository;


    @Override
    public Page<Exercise> findAll(Pageable pageable) {
        return exerciseJpaRepository.findAll(pageable);
    }

    @Override
    public List<Exercise> findAll() {
        return exerciseJpaRepository.findAll();
    }

    @Override
    public Page<Exercise> findByIsPrivateFalseOrCreatorId(Long creatorId, String search, Pageable pageable) {
        return exerciseJpaRepository.findByIsPrivateFalseOrCreatorId(creatorId, search, pageable);
    }

    @Override
    public Page<Exercise> findByIsPrivateFalseOrCreatorIdPl(Long creatorId, String search, Pageable pageable) {
        return exerciseJpaRepository.findByIsPrivateFalseOrCreatorIdPl(creatorId, search, pageable);
    }

    @Override
    public Page<Exercise> findByIsPrivateFalseOrCreatorIdDe(Long creatorId, String search, Pageable pageable) {
        return exerciseJpaRepository.findByIsPrivateFalseOrCreatorIdDe(creatorId, search, pageable);
    }

    @Override
    public Optional<Exercise> findByIdAndIsPrivateFalseOrCreatorId(Long id, Long creatorId) {
        return exerciseJpaRepository.findByIdAndIsPrivateFalseOrCreatorId(id, creatorId);
    }

    @Override
    public Optional<List<Exercise>> findByIdListAndIsPrivateFalseOrCreatorId(List<Long> ids, Long creatorId) {
        return exerciseJpaRepository.findByIdListAndIsPrivateFalseOrCreatorId(ids, creatorId);
    }

    @Override
    public Optional<Exercise> findByIdAccessOnlyCreatorId(Long id, Long creatorId) {
        return exerciseJpaRepository.findByIdAccessOnlyCreatorId(creatorId, id);
    }

    @Override
    public List<ExerciseDtoOnlyEnName> findByMainMuscleInAndIsPrivateFalseOrCreatorId(List<String> mainMuscles, Long creatorId) {
        return exerciseJpaRepository.findByMainMuscleInAndIsPrivateFalseOrCreatorId(mainMuscles, creatorId);
    }

    @Override
    public void save(Exercise exercise) {
        exerciseJpaRepository.save(exercise);
    }

    @Override
    public void delete(Exercise exercise) {
        exerciseJpaRepository.delete(exercise);
    }
}
