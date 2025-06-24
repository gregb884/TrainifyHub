package org.gregb884.messenger.shared;


public interface DomainMapper<D, DTO> {

        DTO toDto(D domain);
        D toDomain(DTO dto);

    }

