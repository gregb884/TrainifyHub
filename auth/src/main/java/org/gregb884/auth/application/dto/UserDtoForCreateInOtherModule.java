package org.gregb884.auth.application.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDtoForCreateInOtherModule {


    String username;
    String firstName;
    String lastName;
    String region;
    long id;

}
