package org.gregb884.messenger.application.port.out;

public interface NotificationPort {


    void sendNotification(String email, String message);

    void sendNewMessageNotification(String recipient, String sender, String message);


}
