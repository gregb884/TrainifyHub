package org.gregb884.messenger.infrastructure.adapter.out.persistence.repositoryAdapter;

import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.domain.model.ChatMessage;
import org.gregb884.messenger.domain.repository.ChatMessageRepositoryPort;
import org.gregb884.messenger.infrastructure.adapter.out.persistence.jpaRepository.ChatMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ChatMessageRepositoryAdapter implements ChatMessageRepositoryPort {

    private final ChatMessageRepository chatMessageRepository;

    @Override
    public List<ChatMessage> findLastMessages(String username) {
        return chatMessageRepository.findLastMessages(username);
    }

    @Override
    public void markMessagesAsRead(String sender, String recipient) {
        chatMessageRepository.markMessagesAsRead(sender, recipient);
    }

    @Override
    public long countUnreadMessages(String recipient) {
        return chatMessageRepository.countUnreadMessages(recipient);
    }

    @Override
    public void save(ChatMessage message) {
        chatMessageRepository.save(message);
    }

    @Override
    public Page<ChatMessage> findChatMessagesBetweenUsers(String sender, String recipient, Pageable pageable) {
        return chatMessageRepository.findChatMessagesBetweenUsers(sender,recipient,pageable);
    }


}
