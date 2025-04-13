package com.trainifyhub.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioAttributes;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "FCM";
    private static boolean isTokenSent = false;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    public static void sendFcmTokenOnAppStart(Context context) {
        if (isTokenSent) {
            return;
        }

        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {
                        return;
                    }

                    String fcmToken = task.getResult();

                    saveFcmToken(context, fcmToken);


                    openTwaWithToken(context, fcmToken);


                    isTokenSent = true;
                });
    }

    private static void openTwaWithToken(Context context, String token) {

        Uri updatedUri = Uri.parse("https://www.trainifyhub.com/dashboard")
                .buildUpon()
                .appendQueryParameter("token", token)
                .build();

        Intent intent = new Intent(context, LauncherActivity.class);
        intent.putExtra("android.support.customtabs.extra.LAUNCH_AS_TRUSTED_WEB_ACTIVITY", true);
        intent.setData(updatedUri);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        context.startActivity(intent);
    }

    private static void saveFcmToken(Context context, String token) {
        SharedPreferences prefs = context.getSharedPreferences("fcm_prefs", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("fcm_token", token);
        editor.apply();
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {


        String channelId = remoteMessage.getData().get("channelId");

        if (AppLifecycleObserver.isAppInForeground()) {

            if ("chat_notification".equals(channelId)) {

                playChatNotificationSound();
            } else {
                playNotificationSound();
            }
        } else {
            if ("chat_notification".equals(channelId)) {
                sendChatNotification(remoteMessage.getNotification().getBody());
            } else {
                sendNotification(remoteMessage.getNotification().getBody());
            }
        }
    }

    private void playNotificationSound() {
        try {
            Uri notification = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.notification);
            Ringtone r = RingtoneManager.getRingtone(getApplicationContext(), notification);
            r.play();
        } catch (Exception e) {
            Log.e(TAG, "❌ Błąd odtwarzania dźwięku powiadomienia", e);
        }
    }

    private void playChatNotificationSound() {
        try {
            Uri chatSound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.messenger);
            Ringtone r = RingtoneManager.getRingtone(getApplicationContext(), chatSound);
            r.play();
        } catch (Exception e) {
            Log.e(TAG, "❌ Błąd odtwarzania dźwięku wiadomości", e);
        }
    }


    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        saveFcmToken(this, token);
    }

    private void sendNotification(String messageBody) {
        Intent intent = new Intent(this, LauncherActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,
                PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE);

        String channelId = "default_channel_id";
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.drawable.ic_notification_icon)
                .setContentTitle("Trainify Hub")
                .setContentText(messageBody)
                .setAutoCancel(true)
                .setColor(getResources().getColor(R.color.backgroundColor))
                .setSound(Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.notification)) // 🟢 Debug
                .setContentIntent(pendingIntent);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelName = getString(R.string.notification_channel_name);
            NotificationChannel channel = new NotificationChannel(channelId, channelName,
                    NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(channel);
        }

        notificationManager.notify(0, notificationBuilder.build());
    }


    private void sendChatNotification(String messageBody) {

        Intent intent = new Intent(this, LauncherActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,
                PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE);

        String chatChannelId = "chat_notification";
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, chatChannelId)
                .setSmallIcon(R.drawable.ic_notification_icon)
                .setContentTitle("Nowa wiadomość")
                .setContentText(messageBody)
                .setAutoCancel(true)
                .setColor(getResources().getColor(R.color.backgroundColor))
                .setSound(Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.messenger))
                .setContentIntent(pendingIntent);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = notificationManager.getNotificationChannel(chatChannelId);
            if (channel != null) {
                Log.d(TAG, "✅ Powiadomienie czatu idzie na kanał: " + chatChannelId);
                Log.d(TAG, "🎵 Dźwięk ustawiony: " + channel.getSound());
            } else {
                Log.e(TAG, "❌ Błąd: Kanał czatu nie istnieje!");
            }
        }

        notificationManager.notify(1, notificationBuilder.build());
    }


    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = getSystemService(NotificationManager.class);

            // 🔥 Kanał dla standardowych powiadomień
            String defaultChannelId = "default_channel_id";
            String defaultChannelName = getString(R.string.notification_channel_name);
            NotificationChannel defaultChannel = new NotificationChannel(
                    defaultChannelId, defaultChannelName, NotificationManager.IMPORTANCE_HIGH);
            defaultChannel.setDescription("Domyślny kanał powiadomień aplikacji");

            // 🟢 Ustawienie dźwięku dla standardowych powiadomień
            Uri defaultSoundUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.notification);
            Log.d(TAG, "🔊 Ustawiam dźwięk domyślnych powiadomień: " + defaultSoundUri.toString());

            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build();
            defaultChannel.setSound(defaultSoundUri, audioAttributes);

            notificationManager.createNotificationChannel(defaultChannel);
            Log.d(TAG, "✅ Kanał standardowy powiadomień utworzony: " + defaultChannelId);

            // 🔥 Kanał dla wiadomości czatu
            String chatChannelId = "chat_notification";
            String chatChannelName = getString(R.string.chat_notification_channel_name);
            NotificationChannel chatChannel = new NotificationChannel(
                    chatChannelId, chatChannelName, NotificationManager.IMPORTANCE_HIGH);
            chatChannel.setDescription("Kanał powiadomień dla wiadomości czatu");

            // 🟢 Ustawienie dźwięku dla powiadomień czatu
            Uri chatSoundUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.messenger);
            Log.d(TAG, "🔊 Ustawiam dźwięk powiadomień czatu: " + chatSoundUri.toString());

            chatChannel.setSound(chatSoundUri, audioAttributes);

            notificationManager.createNotificationChannel(chatChannel);
            Log.d(TAG, "✅ Kanał czatu utworzony: " + chatChannelId);
        }
    }




}