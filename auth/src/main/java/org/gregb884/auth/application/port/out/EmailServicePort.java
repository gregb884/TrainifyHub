package org.gregb884.auth.application.port.out;

public interface EmailServicePort {


    void sendEmail(String to, String subject, String body);
}