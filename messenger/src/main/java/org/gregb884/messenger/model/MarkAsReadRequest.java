package org.gregb884.messenger.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkAsReadRequest {

    private String sender;
    private String recipient;

}
