package org.gregb884.aiassist.repository;

import org.gregb884.aiassist.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request, Long> {

    @Query("SELECT r FROM Request r WHERE r.id = :id AND (r.userId = :userId)")
    Optional<Request> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Request r WHERE r.userId = :userId AND r.aiPlanId != 0 AND r.generatedPlanId = 0")
    Integer countByUserIdToAssign(@Param("userId") Long userId);


    @Query("SELECT COUNT(r) FROM Request r WHERE r.userId = :userId AND r.aiPlanId = 0")
    Integer countByUserIdRequestWithAction(@Param("userId") Long userId);


    @Query("SELECT r FROM Request r WHERE r.userId = :userId AND r.aiPlanId != 0 AND r.generatedPlanId = 0")
    Optional<List<Request>> ListUserIdToAssign(@Param("userId") Long userId);

    @Query("SELECT r FROM Request r WHERE r.userId = :userId AND r.aiPlanId = 0")
    Optional<List<Request>> ListUserIdWithoutPlan(Long userId);
}
