package org.gregb884.messenger.repository;

import jakarta.transaction.Transactional;
import org.gregb884.messenger.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {


    List<ChatMessage> findBySenderOrRecipient(String sender, String recipient);

    @Query("SELECT m FROM ChatMessage m WHERE m.id IN (SELECT MAX(m2.id) FROM ChatMessage m2 WHERE m2.sender = :username OR m2.recipient = :username GROUP BY CASE WHEN m2.sender = :username THEN m2.recipient ELSE m2.sender END) ORDER BY m.timestamp DESC")
    List<ChatMessage> findLastMessages(@Param("username") String username);

    @Query("SELECT m FROM ChatMessage m WHERE (m.sender = :sender AND m.recipient = :recipient) OR (m.sender = :recipient AND m.recipient = :sender) ORDER BY m.timestamp DESC")
    Page<ChatMessage> findChatMessagesBetweenUsers(
            @Param("sender") String sender,
            @Param("recipient") String recipient,
            Pageable pageable);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ChatMessage m SET m.read = true WHERE m.sender = :recipient AND m.recipient = :sender AND m.read = false")
    void markMessagesAsRead(@Param("sender") String sender, @Param("recipient") String recipient);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE (m.sender = :sender AND m.recipient = :recipient) OR (m.sender = :recipient AND m.recipient = :sender)")
    long countMessagesBetweenUsers(@Param("sender") String sender, @Param("recipient") String recipient);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.recipient = :recipient AND m.read = false")
    long countUnreadMessages(@Param("recipient") String recipient);


}
