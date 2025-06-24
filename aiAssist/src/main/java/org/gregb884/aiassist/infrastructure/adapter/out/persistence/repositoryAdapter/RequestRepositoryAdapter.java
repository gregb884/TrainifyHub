package org.gregb884.aiassist.infrastructure.adapter.out.persistence.repositoryAdapter;


import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.domain.model.Request;
import org.gregb884.aiassist.domain.repository.RequestRepositoryPort;
import org.gregb884.aiassist.infrastructure.adapter.out.persistence.jpaRepository.JpaRequestRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RequestRepositoryAdapter implements RequestRepositoryPort {


    private final JpaRequestRepository jpaRequestRepository;

    @Override
    public Optional<Request> findByIdAndUserId(Long id, Long userId) {
        return jpaRequestRepository.findByIdAndUserId(id, userId);
    }

    @Override
    public Integer countByUserIdToAssign(Long userId) {
        return jpaRequestRepository.countByUserIdToAssign(userId);
    }

    @Override
    public Integer countByUserIdRequestWithAction(Long userId) {
        return jpaRequestRepository.countByUserIdRequestWithAction(userId);
    }

    @Override
    public Optional<List<Request>> ListUserIdToAssign(Long userId) {
        return jpaRequestRepository.ListUserIdToAssign(userId);
    }

    @Override
    public Optional<List<Request>> ListUserIdWithoutPlan(Long userId) {
        return jpaRequestRepository.ListUserIdWithoutPlan(userId);
    }

    @Override
    public Request save(Request request) {
        return jpaRequestRepository.save(request);
    }

    @Override
    public void delete(Request request) {
        jpaRequestRepository.delete(request);
    }
}
