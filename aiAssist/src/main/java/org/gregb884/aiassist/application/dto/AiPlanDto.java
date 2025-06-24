package org.gregb884.aiassist.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.gregb884.aiassist.domain.model.AiDay;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiPlanDto {

    private long id;
    private long userId;
    private String planName;
    private String description;
    private List<AiDay> aiDays;
    private String additionalNotes;

}
