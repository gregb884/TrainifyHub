package org.gregb884.trainingmanager.repository;

import org.gregb884.trainingmanager.model.Day;
import org.gregb884.trainingmanager.model.Week;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DayRepository extends JpaRepository<Day, Long> {


    @Query("SELECT d FROM Day d JOIN d.week w JOIN w.trainingPlan tp WHERE d.id = :dayId AND (tp.creatorId = :userId)")
    Optional<Day> findByIdAndOnlyCreatorId(@Param("dayId") Long dayId, @Param("userId") Long userId);

    @Query("SELECT d FROM Day d JOIN d.week w JOIN w.trainingPlan tp JOIN tp.users u WHERE d.id = :dayId AND (u.id = :userId OR tp.creatorId = :userId)")
    Optional<Day> findByIdAndUserIdOrCreatorId(@Param("dayId") Long dayId, @Param("userId") Long userId);

}
