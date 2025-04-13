package org.gregb884.messenger.controller;

import org.gregb884.messenger.dto.ChatMessageWithImgDTO;
import org.gregb884.messenger.model.ChatMessage;
import org.gregb884.messenger.model.MarkAsReadRequest;
import org.gregb884.messenger.service.ChatMessageService;
import org.gregb884.messenger.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ChatRestController {

    private final ChatMessageService chatMessageService;

    private final UserService userService;

    public ChatRestController(SimpMessagingTemplate messagingTemplate, ChatMessageService chatMessageService, UserService userService) {
        this.chatMessageService = chatMessageService;
        this.userService = userService;
    }


    @GetMapping("/messages")
    public Page<ChatMessage> getMessages(@RequestParam String recipient, @RequestParam int page, @RequestParam int size) {

        String sender = userService.getUserName(SecurityContextHolder.getContext().getAuthentication());

        chatMessageService.markMessagesAsRead(sender, recipient);

        return chatMessageService.findMessages(sender, recipient,page,size);
    }

    @GetMapping("/conversations")
    public List<ChatMessageWithImgDTO> getConversations() {
        String username = userService.getUserName(SecurityContextHolder.getContext().getAuthentication());

        List<ChatMessage> messageList = chatMessageService.findLastMessages(username);

        return messageList.stream()
                .map(chatMessage -> chatMessageService.convertToDto(chatMessage,username))
                .collect(Collectors.toList());
    }

    @GetMapping("/messages/unreadCount")
    public long getUnreadMessagesCount(Principal principal) {
        String username = userService.getUserName(principal);
        return chatMessageService.countUnreadMessages(username);
    }

    @PostMapping("/messages/markAsRead")
    public ResponseEntity<Void> markAsRead(@RequestBody MarkAsReadRequest request) {
        chatMessageService.markMessagesAsRead(request.getSender(), request.getRecipient());
        return ResponseEntity.ok().build();
    }

}
