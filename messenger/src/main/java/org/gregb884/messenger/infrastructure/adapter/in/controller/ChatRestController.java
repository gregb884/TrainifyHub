package org.gregb884.messenger.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.messenger.application.dto.ChatMessageWithImgDTO;
import org.gregb884.messenger.application.dto.MarkAsReadRequest;
import org.gregb884.messenger.application.port.in.ChatMessageUseCase;
import org.gregb884.messenger.application.port.in.UserUseCase;
import org.gregb884.messenger.domain.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatRestController {

    private final ChatMessageUseCase chatMessageUseCase;

    private final UserUseCase userUseCase;



    @GetMapping("/messages")
    public Page<ChatMessage> getMessages(@RequestParam String recipient, @RequestParam int page, @RequestParam int size) {

        String sender = userUseCase.getUserName(SecurityContextHolder.getContext().getAuthentication());

        chatMessageUseCase.markMessagesAsRead(sender, recipient);

        return chatMessageUseCase.findMessages(sender, recipient,page,size);
    }

    @GetMapping("/conversations")
    public List<ChatMessageWithImgDTO> getConversations() {
        String username = userUseCase.getUserName(SecurityContextHolder.getContext().getAuthentication());

        List<ChatMessage> messageList = chatMessageUseCase.findLastMessages(username);

        return messageList.stream()
                .map(chatMessage -> chatMessageUseCase.convertToDto(chatMessage,username))
                .collect(Collectors.toList());
    }

    @GetMapping("/messages/unreadCount")
    public long getUnreadMessagesCount(Principal principal) {
        String username = userUseCase.getUserName(principal);
        return chatMessageUseCase.countUnreadMessages(username);
    }

    @PostMapping("/messages/markAsRead")
    public ResponseEntity<Void> markAsRead(@RequestBody MarkAsReadRequest request) {
        chatMessageUseCase.markMessagesAsRead(request.getSender(), request.getRecipient());
        return ResponseEntity.ok().build();
    }

}
