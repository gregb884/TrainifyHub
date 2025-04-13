package org.gregb884.messenger.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatMessageWithImgDTO {


    private Long id;
    private String sender;
    private String content;
    private String recipient;
    private LocalDateTime timestamp;
    private boolean read;
    private String imgUrl;


}
