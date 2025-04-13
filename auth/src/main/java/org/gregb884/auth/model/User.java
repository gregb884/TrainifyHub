package org.gregb884.auth.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "users")
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


    public String getActivationToken() {
        return activationToken;
    }

    public void setActivationToken(String activationToken) {
        this.activationToken = activationToken;
    }

    public boolean isBanned() {
        return isBanned;
    }

    public void setBanned(boolean banned) {
        isBanned = banned;
    }

    public Integer getLoginCount() {
        return loginCount;
    }

    public void setLoginCount(Integer loginCount) {
        this.loginCount = loginCount;
    }

    public Date getReadyMadePlansAccess() {
        return readyMadePlansAccess;
    }

    public void setReadyMadePlansAccess(Date readyMadePlansAccess) {
        this.readyMadePlansAccess = readyMadePlansAccess;
    }

    public Integer getAiCoins() {
        return aiCoins;
    }

    public void setAiCoins(Integer aiCoins) {
        this.aiCoins = aiCoins;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public boolean isPremium() {
        return premium;
    }

    public void setPremium(boolean premium) {
        this.premium = premium;
    }

    public long getId() {
        return id;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public boolean isGoogleAccount() {
        return googleAccount;
    }

    public void setGoogleAccount(boolean googleAccount) {
        this.googleAccount = googleAccount;
    }

    public boolean isAppleAccount() {
        return appleAccount;
    }

    public void setAppleAccount(boolean appleAccount) {
        this.appleAccount = appleAccount;
    }
}
