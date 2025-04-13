package org.gregb884.notification.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Notification {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private long userId;

    private String message;

    private Date timestamp;

    private boolean read;

    public Notification(long userId,String message){

        this.userId = userId;
        this.message = message;
        this.timestamp = new Date();
        this.read = false;
    }



}
