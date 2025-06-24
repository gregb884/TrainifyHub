package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository;


import org.gregb884.trainingmanager.domain.model.Day;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DayJpaRepository extends JpaRepository<Day, Long> {

    @Query("SELECT d FROM Day d JOIN d.week w JOIN w.trainingPlan tp WHERE d.id = :dayId AND (tp.creatorId = :userId)")
    Optional<Day> findByIdAndOnlyCreatorId(@Param("dayId") Long dayId, @Param("userId") Long userId);

    @Query("SELECT d FROM Day d JOIN d.week w JOIN w.trainingPlan tp JOIN tp.users u WHERE d.id = :dayId AND (u.id = :userId OR tp.creatorId = :userId)")
    Optional<Day> findByIdAndUserIdOrCreatorId(@Param("dayId") Long dayId, @Param("userId") Long userId);

}
