package org.gregb884.messenger.application.port.in;

import org.gregb884.messenger.application.dto.ChatMessageWithImgDTO;
import org.gregb884.messenger.domain.model.ChatMessage;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ChatMessageUseCase {


    void markMessagesAsRead(String sender, String recipient);


    Page<ChatMessage> findMessages(String sender, String recipient, int page, int size);

    List<ChatMessage> findLastMessages(String username);

    ChatMessageWithImgDTO convertToDto(ChatMessage chatMessage, String username);

    long countUnreadMessages(String username);

    void saveMessage(ChatMessage chatMessage);
}
