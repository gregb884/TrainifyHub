package org.gregb884.profilemanager.application.dto;

import lombok.Getter;
import lombok.Setter;
import org.gregb884.profilemanager.domain.model.User;

@Getter
@Setter
public class RequestDto {

    private long id;
    private long trainerId;
    private String trainerFirstName;
    private String trainerLastName;
    private User user;
    private boolean isAccepted;
}
