package org.gregb884.aiassist.controller;

import org.gregb884.aiassist.dto.RequestDto;
import org.gregb884.aiassist.model.AiExercise;
import org.gregb884.aiassist.model.AiPlan;
import org.gregb884.aiassist.model.Request;
import org.gregb884.aiassist.service.AiPlanService;
import org.gregb884.aiassist.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/request")
public class RequestController {

    private final RequestService requestService;
    private final AiPlanService aiPlanService;

    public RequestController(RequestService requestService, AiPlanService aiPlanService) {
        this.requestService = requestService;
        this.aiPlanService = aiPlanService;
    }

    @PostMapping("/new")
    public ResponseEntity<Long> requestNew(@RequestBody Request request) throws Exception {

       return requestService.addNewAiRequest(request);

    }

    @PostMapping("/updateStartDate")
    public ResponseEntity<String> updateStartDate(@RequestParam("date") String startDateStr,
                                                  @RequestParam("id") long id) throws Exception {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = formatter.parse(startDateStr);

        return requestService.setNewStartDate(id, startDate);
    }

    @GetMapping("/get")
    public ResponseEntity<Request> getRequestById(@RequestParam("id") long id) {

        return requestService.getRequest(id);

    }

    @GetMapping("/isRendering")
    public ResponseEntity<Boolean> isRequestRendering(@RequestParam("id") long id) {

        return requestService.isRequestRendering(id);


    }

    @PostMapping("/confirmCreate")
    public ResponseEntity<AiPlan> confirmCreate(@RequestParam long id) throws Exception {

        return requestService.createAiPlan(id);

    }


    @GetMapping("/countRequestWithoutPlanQuantity")
    public ResponseEntity<String> requestWithoutPlanQuantity() {

        return requestService.countRequestWithoutPlanQuantity();

    }

    @GetMapping("/countRequestAiToAssign")
    public ResponseEntity<String> requestAiToAssign() {


        return requestService.countRequestToAssign();

    }



    @GetMapping("/requestAiToAssignList")
    public ResponseEntity<List<RequestDto>> requestAiToAssignList() {

        return requestService.requestAiToAssignList();

    }

    @GetMapping("/requestWithoutPlanList")
    public ResponseEntity<List<RequestDto>> requestAiWithoutPlanList() {

        return requestService.requestAiWithoutPlanList();

    }

}
