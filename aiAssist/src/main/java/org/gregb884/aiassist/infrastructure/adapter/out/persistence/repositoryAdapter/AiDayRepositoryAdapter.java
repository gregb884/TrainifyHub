package org.gregb884.aiassist.infrastructure.adapter.out.persistence.repositoryAdapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.domain.repository.AiDayRepositoryPort;
import org.gregb884.aiassist.infrastructure.adapter.out.persistence.jpaRepository.JpaAiDayRepository;
import org.springframework.stereotype.Repository;


@Repository
@RequiredArgsConstructor
public class AiDayRepositoryAdapter implements AiDayRepositoryPort {


    private final JpaAiDayRepository jpaAiDayRepository;



}
