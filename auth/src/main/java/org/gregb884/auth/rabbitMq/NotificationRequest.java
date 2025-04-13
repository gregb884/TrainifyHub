package org.gregb884.auth.rabbitMq;

public class NotificationRequest {

    private String email;
    private String message;


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public NotificationRequest(String email, String message) {
        this.email = email;
        this.message = message;
    }

    public NotificationRequest() {
    }
}
