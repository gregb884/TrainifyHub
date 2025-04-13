package org.gregb884.aiassist.repository;

import org.gregb884.aiassist.model.AiPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AiPlanRepository extends JpaRepository<AiPlan, Long> {


    @Query("SELECT p from AiPlan p WHERE p.userId = :userId AND p.id = :planId")
    Optional<AiPlan> findByIdAndUserId(@Param("userId") Long userId, @Param("planId") Long planId);


}
