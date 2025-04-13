package com.trainifyhub.app;
import android.app.Application;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;

public class AppLifecycleObserver implements DefaultLifecycleObserver {
    private static final String TAG = "AppLifecycleObserver";
    private static boolean isForeground = false;

    private final Handler handler = new Handler(Looper.getMainLooper());

    public AppLifecycleObserver(Application application) {
        ProcessLifecycleOwner.get().getLifecycle().addObserver(this);
    }

    @Override
    public void onStart(LifecycleOwner owner) {
        // 🔥 Opóźnienie 1 sekundy, aby uniknąć fałszywej detekcji "w tle"
        handler.postDelayed(() -> {
            isForeground = true;
            Log.d(TAG, "📲 Aplikacja na pierwszym planie");
        }, 2000);
    }

    @Override
    public void onStop(LifecycleOwner owner) {
        isForeground = false;
        Log.d(TAG, "📌 Aplikacja w tle");
    }

    public static boolean isAppInForeground() {
        return isForeground;
    }
}