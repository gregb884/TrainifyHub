package org.gregb884.messenger.application.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.application.dto.ChatMessageWithImgDTO;
import org.gregb884.messenger.application.mapper.ChatMessageToDtoMapper;
import org.gregb884.messenger.application.port.in.ChatMessageUseCase;
import org.gregb884.messenger.application.port.out.LocalizationPort;
import org.gregb884.messenger.application.port.out.NotificationPort;
import org.gregb884.messenger.application.port.out.UserLanguageFetcherPort;
import org.gregb884.messenger.application.port.out.UserProfileImageFetcherPort;
import org.gregb884.messenger.domain.model.ChatMessage;
import org.gregb884.messenger.domain.repository.ChatMessageRepositoryPort;
import org.gregb884.messenger.infrastructure.adapter.out.persistence.repositoryAdapter.ChatMessageRepositoryAdapter;
import org.gregb884.messenger.infrastructure.security.AuthenticatedUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService implements ChatMessageUseCase {

    private final ChatMessageToDtoMapper chatMessageToDtoMapper;
    private final UserProfileImageFetcherPort userProfileImageFetcherPort;
    private final ChatMessageRepositoryPort chatMessageRepository;
    private final UserLanguageFetcherPort userLanguageFetcherPort;
    private final LocalizationPort localizationPort;
    private final NotificationPort notificationPort;


    @Override
    public void saveMessage(ChatMessage message) {

        message.setTimestamp(LocalDateTime.now());

        chatMessageRepository.save(message);
    }

    @Override
    public Page<ChatMessage> findMessages(String sender, String recipient, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        return chatMessageRepository.findChatMessagesBetweenUsers(sender, recipient,pageable);
    }

    @Transactional
    public void markMessagesAsRead(String sender, String recipient) {

        chatMessageRepository.markMessagesAsRead(sender, recipient);
    }

    @Override
    public List<ChatMessage> findLastMessages(String username) {
        return chatMessageRepository.findLastMessages(username);
    }


    public void sendNewMessageNotification(String recipient, String sender, String message) {

        String language = userLanguageFetcherPort.getLang(recipient);

        String messageToSend = localizationPort.getLocalizedMessage("notification.newConversation",language) + " " + sender + " {}" + message ;

        notificationPort.sendNotification(recipient,messageToSend);
    }


    @Override
    public long countUnreadMessages(String userName) {

        return chatMessageRepository.countUnreadMessages(userName);

    }

    @Override
    public ChatMessageWithImgDTO convertToDto(ChatMessage chatMessage, String userName) {

        ChatMessageWithImgDTO dto = chatMessageToDtoMapper.toDto(chatMessage);

        if (dto.getSender().equals(userName)) {
            dto.setImgUrl(userProfileImageFetcherPort.getImgUrlForUser(dto.getRecipient()));
        } else {
            dto.setImgUrl(userProfileImageFetcherPort.getImgUrlForUser(dto.getSender()));
        }

        return dto;
    }

}
