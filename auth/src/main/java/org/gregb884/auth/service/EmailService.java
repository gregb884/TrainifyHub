package org.gregb884.auth.service;
import jakarta.mail.internet.InternetAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {


    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        try {

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);


            String fromEmail = "confirm@trainifyhub.com";
            String displayName = "Trainify Hub";
            message.setFrom(new InternetAddress(fromEmail, displayName).toString());


            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error while E-mail send : " + e.getMessage());
        }
    }
}