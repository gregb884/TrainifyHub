package org.gregb884.trainingmanager.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.trainingmanager.application.dto.DayDto;
import org.gregb884.trainingmanager.application.port.in.DayCreateUseCase;
import org.gregb884.trainingmanager.application.port.in.DayUseCase;
import org.gregb884.trainingmanager.domain.model.Day;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/day")
public class DayController {


    private final DayUseCase dayUseCase;
    private final DayCreateUseCase dayCreateUseCase;


    @GetMapping("/get")
    public ResponseEntity<?> getDay(@RequestParam long id) {

        try {
            Optional<Day> day = dayUseCase.getDayWithAccessControl(id);
            if (day.isPresent()) {
                return ResponseEntity.ok(day.get());
            }

        } catch (Exception e){

            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.notFound().build();
    }


    @PostMapping("/create")
    public ResponseEntity<String> createDay(@RequestBody DayDto dayDto,
                                            @RequestParam long weekId) {


        if(dayCreateUseCase.create(weekId,dayDto))
        {
            return ResponseEntity.ok("Day created");
        } else return ResponseEntity.badRequest().body("Error creating day");
    }


    @PostMapping("/edit")
    public ResponseEntity<String> editDay(@RequestBody DayDto dayDto,
                                          @RequestParam long dayId) {

        if(dayUseCase.edit(dayId,dayDto))
        {
            return ResponseEntity.ok("Day Edit successfully");
        } else
            return ResponseEntity.badRequest().body("Error editing day");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteDay(@RequestParam long id) {

        if (dayUseCase.delete(id))
        {
            return ResponseEntity.ok("Day deleted successfully");
        } else return ResponseEntity.badRequest().body("Error deleting day");

    }


    @PostMapping("/done")
    public ResponseEntity<String> doneDay(@RequestParam long id) throws Exception {

        if (dayUseCase.setDone(id)) return ResponseEntity.ok("done");
        else return ResponseEntity.badRequest().body("Error edit Day");

    }




}
