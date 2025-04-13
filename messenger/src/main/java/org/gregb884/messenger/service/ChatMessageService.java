package org.gregb884.messenger.service;

import jakarta.transaction.Transactional;
import org.gregb884.messenger.dto.ChatMessageWithImgDTO;
import org.gregb884.messenger.model.ChatMessage;
import org.gregb884.messenger.repository.ChatMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatMessageService {


    private final ChatMessageRepository chatMessageRepository;

    private final UserService userService;
    private final LocalizationService localizationService;
    private final NotificationService notificationService;

    public ChatMessageService(ChatMessageRepository chatMessageRepository, UserService userService, LocalizationService localizationService, NotificationService notificationService) {
        this.chatMessageRepository = chatMessageRepository;
        this.userService = userService;
        this.localizationService = localizationService;
        this.notificationService = notificationService;
    }


    public void saveMessage(ChatMessage message) {

        message.setTimestamp(LocalDateTime.now());

        chatMessageRepository.save(message);
    }

    public Page<ChatMessage> findMessages(String sender, String recipient, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        return chatMessageRepository.findChatMessagesBetweenUsers(sender, recipient,pageable);
    }

    @Transactional
    public void markMessagesAsRead(String sender, String recipient) {

        chatMessageRepository.markMessagesAsRead(sender, recipient);
    }

    public List<ChatMessage> findLastMessages(String username) {
        return chatMessageRepository.findLastMessages(username);
    }


    public void sendNewMessageNotification(String recipient, String sender, String message) {

        String language = userService.getLang(recipient);

        String messageToSend = localizationService.getLocalizedMessage("notification.newConversation",language) + " " + sender + " {}" + message ;

        notificationService.sendNotification(recipient,messageToSend);
    }


    public long countUnreadMessages(String userName) {

        return chatMessageRepository.countUnreadMessages(userName);

    }


    public ChatMessageWithImgDTO convertToDto(ChatMessage chatMessage, String userName) {
        ChatMessageWithImgDTO dto = new ChatMessageWithImgDTO();
        dto.setId(chatMessage.getId());
        dto.setSender(chatMessage.getSender());
        dto.setContent(chatMessage.getContent());
        dto.setRecipient(chatMessage.getRecipient());
        dto.setTimestamp(chatMessage.getTimestamp());
        dto.setRead(chatMessage.isRead());

        if (dto.getSender().equals(userName)) {

            dto.setImgUrl(userService.getImgUrlForUser(dto.getRecipient()));

        }

        else {

            dto.setImgUrl(userService.getImgUrlForUser(dto.getSender()));
        }



        return dto;
    }

}
