package org.gregb884.profilemanager.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.dto.RequestDto;
import org.gregb884.profilemanager.application.port.in.ManageRequestUseCase;
import org.gregb884.profilemanager.application.port.in.ReadRequestUseCase;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/request")
public class RequestController {


    private final ManageRequestUseCase manageRequestUseCase;
    private final ReadRequestUseCase readRequestUseCase;



    @PostMapping("/new")
    public ResponseEntity<String> newRequest(@RequestParam long trainerId) {

        try {
            manageRequestUseCase.addNewRequest(trainerId);
            return ResponseEntity.ok("Request added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getMyRequest")
    public ResponseEntity<Page<RequestDto>> getMyRequest(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "5") int size,
                                                         @RequestParam(required = false) String search) {

        try {
           return ResponseEntity.ok(readRequestUseCase.myRequest(page, size, search));
        } catch (Exception e) {

            return ResponseEntity.badRequest().build();

        }

    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteRequest(@RequestParam long requestId) {

        try {
            return ResponseEntity.ok(manageRequestUseCase.deleteRequest(requestId));
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptRequest(@RequestParam long requestId) {

        try {
            return ResponseEntity.ok(manageRequestUseCase.acceptRequest(requestId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/countRequest")
    public ResponseEntity<String> countRequest() {

        try {
            return ResponseEntity.ok(readRequestUseCase.countNewRequest().toString());
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }


    }


}
