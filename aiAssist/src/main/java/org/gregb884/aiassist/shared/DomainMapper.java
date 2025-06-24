package org.gregb884.aiassist.shared;


public interface DomainMapper<D, DTO> {


        DTO toDto(D domain);
        D toDomain(DTO dto);

    }

