package org.gregb884.auth.infrastructure.scheduler;

import org.gregb884.auth.application.port.out.NotificationServicePort;
import org.gregb884.auth.infrastructure.service.LocalizationService;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.concurrent.ScheduledFuture;

@Service
@EnableScheduling
public class SubscriptionReminderScheduler {


    private final TaskScheduler taskScheduler;
    private final NotificationServicePort notificationServicePort;
    private final LocalizationService localizationService;

    public SubscriptionReminderScheduler(TaskScheduler taskScheduler, NotificationServicePort notificationServicePort, LocalizationService localizationService) {
        this.taskScheduler = taskScheduler;
        this.notificationServicePort = notificationServicePort;
        this.localizationService = localizationService;
    }


    public ScheduledFuture<?> scheduleSubscriptionEndNotification(Long expiryTime, String zone, String username, String lang) {

        Instant expiryInstant = Instant.ofEpochMilli(expiryTime);

        ZoneId zoneId = (zone != null && !zone.isEmpty()) ? ZoneId.of(zone) : ZoneId.of("UTC");

        ZonedDateTime expiryDateTimeUser = expiryInstant.atZone(zoneId);

        Date expiryDate = Date.from(expiryDateTimeUser.toInstant());


        return taskScheduler.schedule(() -> {
            notificationServicePort.sendNotification(username, localizationService.getLocalizedMessage("subscription.end", lang ));
        }, expiryDate);
    }

}