package org.gregb884.messenger.application.mapper;

import org.gregb884.messenger.application.dto.ChatMessageWithImgDTO;
import org.gregb884.messenger.domain.model.ChatMessage;
import org.gregb884.messenger.shared.DomainMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChatMessageToDtoMapper extends DomainMapper<ChatMessage, ChatMessageWithImgDTO> {

    @Override
    ChatMessageWithImgDTO toDto(ChatMessage domain);

    @Override
    ChatMessage toDomain(ChatMessageWithImgDTO chatMessageWithImgDTO);

}
