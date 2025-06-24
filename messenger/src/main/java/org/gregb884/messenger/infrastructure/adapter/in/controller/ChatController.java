package org.gregb884.messenger.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.application.port.in.ChatMessageUseCase;
import org.gregb884.messenger.application.port.in.UserUseCase;
import org.gregb884.messenger.application.port.out.NotificationPort;
import org.gregb884.messenger.domain.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    private final ChatMessageUseCase chatMessageUseCase;

    private final NotificationPort notificationPort;

    private final UserUseCase userUseCase;


    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessage chatMessage, Principal principal) {
        String sender = userUseCase.getUserName(principal);
        chatMessage.setSender(sender);
        chatMessageUseCase.saveMessage(chatMessage);

        String recipientChannel = "/queue/messages/" + chatMessage.getRecipient();
        String senderChannel = "/queue/messages/" + sender;

        messagingTemplate.convertAndSendToUser(chatMessage.getRecipient(), recipientChannel, chatMessage);
        messagingTemplate.convertAndSendToUser(sender, senderChannel, chatMessage);

        chatMessageUseCase.markMessagesAsRead(sender, chatMessage.getRecipient());

        notificationPort.sendNewMessageNotification(chatMessage.getRecipient(),sender, chatMessage.getContent());


        long unreadCount = chatMessageUseCase.countUnreadMessages(chatMessage.getRecipient());


        messagingTemplate.convertAndSendToUser(chatMessage.getRecipient(), "/queue/unreadCount", unreadCount);

    }

    @MessageMapping("/chat.addUser")
    @SendToUser("/queue/messages")
    public ChatMessage addUser(ChatMessage chatMessage, Principal principal) {
        String sender = userUseCase.getUserName(principal);
        chatMessage.setSender(sender);
        return chatMessage;
    }

}
