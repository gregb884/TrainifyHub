package org.gregb884.aiassist.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private long userId;

    private String planName;

    @Column(length = 1000)
    private String description;

    @JsonManagedReference
    @OneToMany(mappedBy = "aiPlan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AiDay> aiDays;

    @Column(length = 1000)
    private String additionalNotes;

}
