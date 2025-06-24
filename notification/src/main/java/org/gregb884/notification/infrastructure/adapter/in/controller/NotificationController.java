package org.gregb884.notification.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.notification.application.port.in.NotificationUseCase;
import org.gregb884.notification.domain.model.Notification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {


    private final NotificationUseCase notificationUseCase;



    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {


        List<Notification> notifications = notificationUseCase.getUnreadNotificationsForUser();
        return ResponseEntity.ok(notifications);


    }

    @PostMapping("/mark-as-read")
    public ResponseEntity<Void> markAsRead(@RequestParam long notificationId) {

        notificationUseCase.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }


}
