package org.gregb884.statistic.infrastructure.shared;


public interface DomainMapper<D, DTO> {

        DTO toDto(D domain);
        D toDomain(DTO dto);

    }

