package org.gregb884.auth.application.port.out;

public interface NotificationServicePort {

    void sendNotification(String email, String message);
}