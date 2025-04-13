package org.gregb884.profilemanager.controller;

import org.gregb884.profilemanager.dto.RequestDto;
import org.gregb884.profilemanager.model.Request;
import org.gregb884.profilemanager.service.RequestService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/request")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }


    @PostMapping("/new")
    public ResponseEntity<String> newRequest(@RequestParam long trainerId) {


        return requestService.addNewRequest(trainerId);

    }

    @GetMapping("/getMyRequest")
    public ResponseEntity<Page<RequestDto>> getMyRequest(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "5") int size,
                                                         @RequestParam(required = false) String search) {

        return requestService.myRequest(page,size,search);

    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteRequest(@RequestParam long requestId) {

        return requestService.deleteRequest(requestId);
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptRequest(@RequestParam long requestId) {

        return requestService.acceptRequest(requestId);

    }

    @GetMapping("/countRequest")
    public ResponseEntity<String> countRequest() {


        return requestService.countNewRequest();

    }


}
