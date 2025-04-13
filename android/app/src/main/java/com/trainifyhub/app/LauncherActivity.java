
package com.trainifyhub.app;

import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;


public class LauncherActivity
        extends com.google.androidbrowserhelper.trusted.LauncherActivity {




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        MyFirebaseMessagingService.sendFcmTokenOnAppStart(this);
        // Setting an orientation crashes the app due to the transparent background on Android 8.0
        // Oreo and below. We only set the orientation on Oreo and above. This only affects the
        // splash screen and Chrome will still respect the orientation.
        // See https://github.com/GoogleChromeLabs/bubblewrap/issues/496 for details.
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.O) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        } else {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        }

        clearNotificationBadge();

        checkNotificationPermission();

    }

    private void checkNotificationPermission() {
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            if (!notificationManager.areNotificationsEnabled()) {
                Toast.makeText(this, getString(R.string.notifications_disabled), Toast.LENGTH_LONG).show();
            }
        }
    }


    @Override
    protected void onResume() {
        super.onResume();


        clearNotificationBadge();
    }


    private void clearNotificationBadge() {
        NotificationManager notificationManager = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        }
        if (notificationManager != null) {
            notificationManager.cancelAll();
        }
    }

    @Override
    protected Uri getLaunchingUrl() {

        Uri uri = super.getLaunchingUrl();
        
        return uri;
    }
}
