package org.gregb884.trainingmanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.core.annotation.Order;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Day {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String name;
    private Date plannedDate;
    private Date doneDate;
    private long creatorId;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "week_id")
    private Week week;

    @JsonManagedReference
    @OrderBy("exerciseOrder ASC")
    @OneToMany(mappedBy = "day", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ExercisePlan> exercisePlans;


    @DateTimeFormat(iso= DateTimeFormat.ISO.DATE)
    public Date getPlannedDate() {
        return plannedDate;
    }

    @DateTimeFormat(iso= DateTimeFormat.ISO.DATE)
    public Date getDoneDate() {
        return doneDate;
    }


}
