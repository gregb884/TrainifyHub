package org.gregb884.auth.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(unique = true, nullable = false)
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String role;
    private boolean verified = false;
    private boolean premium = false;
    private boolean googleAccount = false;
    private boolean appleAccount = false;
    private String lang;
    private Date readyMadePlansAccess;
    private Integer aiCoins;
    private Integer loginCount;
    private boolean isBanned = false;
    @Column(columnDefinition = "TEXT")
    private String activationToken;

}
