package org.gregb884.trainingmanager.infrastructure.adapter.in.controller;

import lombok.AllArgsConstructor;
import org.gregb884.trainingmanager.application.dto.WeekDto;
import org.gregb884.trainingmanager.application.port.in.WeekUseCase;
import org.gregb884.trainingmanager.domain.model.Week;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/week")
public class WeekController {

    private final WeekUseCase weekUseCase;


    @PostMapping("/create")
    public long createWeek(@RequestBody WeekDto weekDto,
                           @RequestParam long planId) {


       return weekUseCase.createNew(planId,weekDto);

    }

    @GetMapping("/view")
    public ResponseEntity<Week> viewWeek(@RequestParam long id) throws Exception {

       Optional<Week> week = weekUseCase.getWithAccessControl(id);

       return week.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    @PostMapping("/edit")
    public ResponseEntity<String> editWeek(@RequestBody Week week,
                                         @RequestParam long id) {

        if (weekUseCase.edit(id,week)) {

            return ResponseEntity.ok("Edited week");

        }

        return ResponseEntity.status(401).build();

    }


    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteWeek(@RequestParam long id) {

        if (weekUseCase.deleteWeek(id)) {

            return ResponseEntity.ok("Week deleted");

        }

        return ResponseEntity.status(401).build();

    }

    @PostMapping("/duplicate-week")
    public ResponseEntity<String> duplicateWeek(@RequestBody WeekDto weekDto,@RequestParam long weekId){


        try {
            if (weekUseCase.cloneWeek(weekId, weekDto)){
                return ResponseEntity.ok("Create new week successfully");
            } else throw new Exception("Error while clone week");
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    
}
