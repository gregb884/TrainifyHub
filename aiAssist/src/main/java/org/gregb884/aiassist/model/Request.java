package org.gregb884.aiassist.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Request {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String goal;
    private String experience;
    private String days;
    private int sessionTime;
    private String equipment;
    @Column(columnDefinition = "TEXT")
    private String preferences;
    private long lastPlanId;
    @Column(columnDefinition = "TEXT")
    private String lastPlanDescription;
    private long userId;
    private long generatedPlanId;
    private Date startDate;
    private boolean previousOk;
    private String primaryFocus;
    @Column(columnDefinition = "TEXT")
    private String aiAnswer;
    private long aiPlanId;
    private Boolean isRendering;

}
