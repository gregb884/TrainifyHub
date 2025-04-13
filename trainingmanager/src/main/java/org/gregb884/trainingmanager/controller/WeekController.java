package org.gregb884.trainingmanager.controller;

import org.gregb884.trainingmanager.dto.WeekDto;
import org.gregb884.trainingmanager.model.Week;
import org.gregb884.trainingmanager.service.TrainingPlanService;
import org.gregb884.trainingmanager.service.WeekService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/week")
public class WeekController {

    private final WeekService weekService;
    private final TrainingPlanService trainingPlanService;


    public WeekController(WeekService weekService, TrainingPlanService trainingPlanService) {
        this.weekService = weekService;
        this.trainingPlanService = trainingPlanService;
    }


    @PostMapping("/create")
    public long createWeek(@RequestBody WeekDto weekDto,
                           @RequestParam long planId) {


       return weekService.createNew(planId,weekDto);

    }

    @GetMapping("/view")
    public ResponseEntity<Week> viewWeek(@RequestParam long id) throws Exception {

       Optional<Week> week = weekService.getWithAccessControl(id);

       return week.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    @PostMapping("/edit")
    public ResponseEntity<String> editWeek(@RequestBody Week week,
                                         @RequestParam long id) {

        if (weekService.edit(id,week)) {

            return ResponseEntity.ok("Edited week");

        }

        return ResponseEntity.status(401).build();

    }


    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteWeek(@RequestParam long id) {

        if (weekService.deleteWeek(id)) {

            return ResponseEntity.ok("Week deleted");

        }

        return ResponseEntity.status(401).build();

    }

    @PostMapping("/duplicate-week")
    public ResponseEntity<String> duplicateWeek(@RequestBody WeekDto weekDto,@RequestParam long weekId){


        if (weekService.duplicateWeek(weekId, weekDto)){

            return ResponseEntity.ok("Create new week successfully");
        }

        return ResponseEntity.status(401).build();

    }
    
}
