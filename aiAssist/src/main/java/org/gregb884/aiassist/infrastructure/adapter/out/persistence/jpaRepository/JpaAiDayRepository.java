package org.gregb884.aiassist.infrastructure.adapter.out.persistence.jpaRepository;

import org.gregb884.aiassist.domain.model.AiDay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaAiDayRepository extends JpaRepository<AiDay, Long> {



}
