package org.gregb884.notification.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.json}")
    private String firebaseKeyJson;

    @PostConstruct
    public void initialize() {
        try {
            if (!FirebaseApp.getApps().isEmpty()) {
                return;
            }

            if (firebaseKeyJson == null || firebaseKeyJson.isEmpty()) {
                throw new IllegalStateException("⚠️ Missing FIREBASE_KEY!");
            }

            ByteArrayInputStream serviceAccount = new ByteArrayInputStream(firebaseKeyJson.getBytes(StandardCharsets.UTF_8));

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);

        } catch (IOException e) {
            throw new RuntimeException("❌ Error init Firebase!", e);
        }
    }
}