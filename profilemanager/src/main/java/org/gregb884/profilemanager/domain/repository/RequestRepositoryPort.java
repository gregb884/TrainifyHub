package org.gregb884.profilemanager.domain.repository;

import org.gregb884.profilemanager.domain.model.Request;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface RequestRepositoryPort {


    Page<Request> findAllByUserIdAndTrainerIdPage(Long id, String search, Pageable pageable);

    Optional<Request> findByRequestIdOnlyUserIdOrTrainerId(Long requestId, Long userId);

    Optional<Request> findByRequestIdOnlyTrainerId(Long requestId, Long userId);

    Long countNewRequest(Long userId);

    void save(Request request);

    void delete(Request request);
}
