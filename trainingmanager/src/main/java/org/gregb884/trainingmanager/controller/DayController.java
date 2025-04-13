package org.gregb884.trainingmanager.controller;

import org.gregb884.trainingmanager.dto.DayDto;
import org.gregb884.trainingmanager.model.Day;
import org.gregb884.trainingmanager.service.DayService;
import org.gregb884.trainingmanager.service.TrainingPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/day")
public class DayController {

    private final DayService dayService;
    private final TrainingPlanService trainingPlanService;

    public DayController(DayService dayService, TrainingPlanService trainingPlanService) {
        this.dayService = dayService;
        this.trainingPlanService = trainingPlanService;
    }


    @GetMapping("/get")
    public ResponseEntity<Day> getDay(@RequestParam long id) throws Exception {

        Optional<Day> day = dayService.getDayWithAccessControl(id);

        return day.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PostMapping("/create")
    public ResponseEntity<String> createDay(@RequestBody DayDto dayDto,
                                            @RequestParam long weekId) {


        if(dayService.create(weekId,dayDto))
        {
            return ResponseEntity.ok("Day created");
        } else

            return ResponseEntity.badRequest().body("Error creating day");
    }


    @PostMapping("/edit")
    public ResponseEntity<String> editDay(@RequestBody DayDto dayDto,
                                          @RequestParam long dayId) {

        if(dayService.edit(dayId,dayDto))
        {
            return ResponseEntity.ok("Day Edit successfully");
        } else
            return ResponseEntity.badRequest().body("Error editing day");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteDay(@RequestParam long id) {

        if (dayService.delete(id))
        {

            return ResponseEntity.ok("Day deleted successfully");

        } else

            return ResponseEntity.badRequest().body("Error deleting day");

    }


    @PostMapping("/done")
    public ResponseEntity<String> doneDay(@RequestParam long id) throws Exception {

        return dayService.setDone(id);

    }




}
