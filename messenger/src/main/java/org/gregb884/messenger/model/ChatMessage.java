package org.gregb884.messenger.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_messages")
public class ChatMessage {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sender;
    private String content;
    private String recipient;
    private LocalDateTime timestamp;
    @Column(name = "read")
    private boolean read;



    public ChatMessage(String sender,String recipient, String content, LocalDateTime timestamp) {
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
        this.recipient = recipient;
        this.read = false;
    }



}
