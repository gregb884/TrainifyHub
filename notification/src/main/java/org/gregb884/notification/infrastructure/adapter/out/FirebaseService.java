package org.gregb884.notification.infrastructure.adapter.out;

import com.google.firebase.messaging.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseService {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseService.class);


    public void sendPushNotification(String token, String title, String message) {
        if (token == null || token.isEmpty()) {
            logger.warn("⚠️ Token FCM jest pusty, pominięto wysyłanie powiadomienia.");
            return;
        }

        try {
            Map<String, String> data = new HashMap<>();
            data.put("channelId", "default_channel_id");
            data.put("type", "general");
            data.put("message", message);

            Message firebaseMessage = Message.builder()
                    .setToken(token)
                    .putAllData(data)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(message)
                            .build())
                    .setAndroidConfig(AndroidConfig.builder()
                            .setNotification(AndroidNotification.builder()
                                    .setChannelId("default_channel_id")
                                    .setIcon("ic_notification_icon")
                                    .setColor("#34322E")
                                    .setSound("notification")
                                    .build())
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setSound("notification.wav")
                                    .setBadge(1)
                                    .setContentAvailable(true)
                                    .setMutableContent(true)
                                    .build())
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(firebaseMessage);
            logger.info("✅ Wysłano standardowe powiadomienie FCM do {} | ID: {}", token, response);

        } catch (FirebaseMessagingException e) {
            logger.error("❌ Błąd wysyłania powiadomienia FCM do {}: {}", token, e.getMessage(), e);
        }
    }


    public void sendPushNotificationMessenger(String token, String title, String message) {
        if (token == null || token.isEmpty()) {
            logger.warn("⚠️ Token FCM jest pusty, pominięto wysyłanie powiadomienia.");
            return;
        }

        try {
            Map<String, String> data = new HashMap<>();
            data.put("channelId", "chat_notification");
            data.put("type", "chat");
            data.put("message", message);

            Message firebaseMessage = Message.builder()
                    .setToken(token)
                    .putAllData(data) // 🔥 Dodajemy `data`
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(message)
                            .build())
                    .setAndroidConfig(AndroidConfig.builder()
                            .setNotification(AndroidNotification.builder()
                                    .setChannelId("chat_notification")
                                    .setIcon("ic_notification_icon")
                                    .setColor("#34322E")
                                    .setSound("messenger")
                                    .build())
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setSound("messenger.mp3")
                                    .setBadge(1)
                                    .setContentAvailable(true)
                                    .setMutableContent(true)
                                    .build())
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(firebaseMessage);
            logger.info("✅ Wysłano powiadomienie FCM czatu do {} | ID: {}", token, response);

        } catch (FirebaseMessagingException e) {
            logger.error("❌ Błąd wysyłania powiadomienia FCM czatu do {}: {}", token, e.getMessage(), e);
        }
    }
}