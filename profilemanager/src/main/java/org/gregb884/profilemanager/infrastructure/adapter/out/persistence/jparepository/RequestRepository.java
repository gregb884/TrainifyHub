package org.gregb884.profilemanager.infrastructure.adapter.out.persistence.jparepository;

import org.gregb884.profilemanager.domain.model.Request;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request,Long> {


    @Query("SELECT r FROM Request r WHERE" +
            " (:search IS NULL OR LOWER(r.user.username) LIKE LOWER(CONCAT('%', :search, '%'))" +
            " OR LOWER(r.user.firstName) LIKE LOWER(CONCAT('%', :search, '%'))" +
            " OR LOWER(r.user.lastName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            " AND (r.user.id = :id OR r.trainer.id = :id)" +
            " ORDER BY r.id DESC")
    Page<Request> findAllByUserIdAndTrainerIdPage(@Param("id") Long id, @Param("search") String search, Pageable pageable);

    @Query("SELECT r FROM Request r WHERE r.id = :requestId AND (r.user.id = :userId OR r.trainer.id = :userId)")
    Optional<Request> findByRequestIdOnlyUserIdOrTrainerId(@Param("requestId") Long requestId, @Param("userId") Long userId);

    @Query("SELECT r FROM Request r WHERE r.id = :requestId AND (r.trainer.id = :userId)")
    Optional<Request> findByRequestIdOnlyTrainerId(@Param("requestId") Long requestId, @Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Request r WHERE r.trainer.id = :userId AND r.isAccepted = false")
    Long countNewRequest(@Param("userId") Long userId);
}
