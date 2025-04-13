package org.gregb884.profilemanager.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Request {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    private boolean isAccepted = false;

    private boolean isRead = false;

}
