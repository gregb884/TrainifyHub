package org.gregb884.trainingmanager.repository;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.model.Week;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Transactional
public interface WeekRepository extends JpaRepository<Week, Long> {


    @Query("SELECT w FROM Week w JOIN w.trainingPlan tp JOIN tp.users u WHERE w.id = :weekId AND (u.id = :userId OR tp.creatorId = :userId)")
    Optional<Week> findByIdAndUserId(@Param("weekId") Long weekId, @Param("userId") Long userId);

    @Query("SELECT w FROM Week w JOIN w.trainingPlan tp JOIN tp.users u WHERE w.id = :weekId AND (tp.creatorId = :userId)")
    Optional<Week> findByIdAndOnlyCreatorId(@Param("weekId") Long weekId, @Param("userId") Long userId);

}
