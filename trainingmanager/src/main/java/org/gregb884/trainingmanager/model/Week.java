package org.gregb884.trainingmanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Week {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private Date startDate;
    private Date endDate;
    private Boolean done;
    private long creatorId;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "training_plan_id")
    private TrainingPlan trainingPlan;

    @JsonManagedReference
    @OneToMany(mappedBy = "week", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("plannedDate ASC")
    private Set<Day> days;


    @DateTimeFormat(iso= DateTimeFormat.ISO.DATE)
    public Date getStartDate() {
        return startDate;
    }

    @DateTimeFormat(iso= DateTimeFormat.ISO.DATE)
    public Date getEndDate() {
        return endDate;
    }

}
