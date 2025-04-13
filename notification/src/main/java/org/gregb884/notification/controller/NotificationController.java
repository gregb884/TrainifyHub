package org.gregb884.notification.controller;

import org.gregb884.notification.model.Notification;
import org.gregb884.notification.service.NotificationService;
import org.gregb884.notification.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {


    private final NotificationService notificationService;
    private final UserService userService;


    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }


    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {

        Long userId = userService.getUserId();
        List<Notification> notifications = notificationService.getUnreadNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);


    }

    @PostMapping("/mark-as-read")
    public ResponseEntity<Void> markAsRead(@RequestParam long notificationId) {

        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }


}
