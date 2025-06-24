package org.gregb884.profilemanager.shared;


public interface DomainMapper<D, DTO> {

        DTO toDto(D domain);
        D toDomain(DTO dto);

    }

