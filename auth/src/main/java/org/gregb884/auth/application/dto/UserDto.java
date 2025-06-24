package org.gregb884.auth.application.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {

    private String username;
    private String password;
    private String confirmPassword;
    private String firstName;
    private String lastName;
    private String role;
    private String lang;

}
