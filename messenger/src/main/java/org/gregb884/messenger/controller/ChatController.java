package org.gregb884.messenger.controller;

import org.gregb884.messenger.model.ChatMessage;
import org.gregb884.messenger.service.ChatMessageService;
import org.gregb884.messenger.service.UserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    private final ChatMessageService chatMessageService;

    private final UserService userService;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatMessageService chatMessageService, UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.chatMessageService = chatMessageService;
        this.userService = userService;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessage chatMessage, Principal principal) {
        String sender = userService.getUserName(principal);
        chatMessage.setSender(sender);
        chatMessageService.saveMessage(chatMessage);

        String recipientChannel = "/queue/messages/" + chatMessage.getRecipient();
        String senderChannel = "/queue/messages/" + sender;


        messagingTemplate.convertAndSendToUser(chatMessage.getRecipient(), recipientChannel, chatMessage);
        messagingTemplate.convertAndSendToUser(sender, senderChannel, chatMessage);

        chatMessageService.markMessagesAsRead(sender, chatMessage.getRecipient());


            chatMessageService.sendNewMessageNotification(chatMessage.getRecipient(),sender, chatMessage.getContent());


        long unreadCount = chatMessageService.countUnreadMessages(chatMessage.getRecipient());


        messagingTemplate.convertAndSendToUser(chatMessage.getRecipient(), "/queue/unreadCount", unreadCount);

    }

    @MessageMapping("/chat.addUser")
    @SendToUser("/queue/messages")
    public ChatMessage addUser(ChatMessage chatMessage, Principal principal) {
        String sender = userService.getUserName(principal);
        chatMessage.setSender(sender);
        return chatMessage;
    }

}
