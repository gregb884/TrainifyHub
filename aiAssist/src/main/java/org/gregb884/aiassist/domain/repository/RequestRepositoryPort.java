package org.gregb884.aiassist.domain.repository;

import org.gregb884.aiassist.domain.model.Request;

import java.util.List;
import java.util.Optional;

public interface RequestRepositoryPort {

    Optional<Request> findByIdAndUserId(Long id, Long userId);

    Integer countByUserIdToAssign(Long userId);

    Integer countByUserIdRequestWithAction(Long userId);

    Optional<List<Request>> ListUserIdToAssign(Long userId);

    Optional<List<Request>> ListUserIdWithoutPlan(Long userId);

    Request save(Request request);

    void delete(Request request);

}
