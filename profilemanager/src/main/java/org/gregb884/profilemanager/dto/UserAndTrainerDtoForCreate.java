package org.gregb884.profilemanager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAndTrainerDtoForCreate {

    private long id;
    private String username;
    private String firstName;
    private String lastName;
    private String region;
}
