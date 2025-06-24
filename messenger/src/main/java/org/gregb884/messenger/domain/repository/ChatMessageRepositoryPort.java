package org.gregb884.messenger.domain.repository;

import org.gregb884.messenger.domain.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepositoryPort {

    List<ChatMessage> findLastMessages(String username);

    void markMessagesAsRead(String sender, String recipient);

    long countUnreadMessages(String recipient);

    void save(ChatMessage message);

    Page<ChatMessage> findChatMessagesBetweenUsers(String sender, String recipient, Pageable pageable);
}
