package org.gregb884.profilemanager.infrastructure.adapter.out.persistence.repositoryadapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.domain.model.Request;
import org.gregb884.profilemanager.domain.repository.RequestRepositoryPort;
import org.gregb884.profilemanager.infrastructure.adapter.out.persistence.jparepository.RequestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RequestRepositoryAdapter implements RequestRepositoryPort {


    private final RequestRepository repository;

    @Override
    public Page<Request> findAllByUserIdAndTrainerIdPage(Long id, String search, Pageable pageable) {
        return repository.findAllByUserIdAndTrainerIdPage(id, search, pageable);
    }

    @Override
    public Optional<Request> findByRequestIdOnlyUserIdOrTrainerId(Long requestId, Long userId) {
        return repository.findByRequestIdOnlyUserIdOrTrainerId(requestId,userId);
    }

    @Override
    public Optional<Request> findByRequestIdOnlyTrainerId(Long requestId, Long userId) {
        return repository.findByRequestIdOnlyTrainerId(requestId,userId);
    }

    @Override
    public Long countNewRequest(Long userId) {
        return repository.countNewRequest(userId);
    }

    @Override
    public void save(Request request) {
        repository.save(request);
    }

    @Override
    public void delete(Request request) {
        repository.delete(request);
    }
}
