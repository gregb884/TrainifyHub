package org.gregb884.aiassist.infrastructure.adapter.in.controller;

import lombok.RequiredArgsConstructor;
import org.gregb884.aiassist.application.dto.AiPlanDto;
import org.gregb884.aiassist.application.dto.RequestCreateDto;
import org.gregb884.aiassist.application.dto.RequestDto;
import org.gregb884.aiassist.application.dto.RequestOnlyIdDto;
import org.gregb884.aiassist.application.port.in.AiPlanUseCase;
import org.gregb884.aiassist.application.port.in.RequestUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/request")
public class RequestController {

    private final RequestUseCase requestUseCase;
    private final AiPlanUseCase aiPlanUseCase;



    @PostMapping("/new")
    public ResponseEntity<String> requestNew(@RequestBody RequestCreateDto request) throws Exception {

        try {
            Long requestId = requestUseCase.addNewAiRequest(request);
            return ResponseEntity.ok(Long.toString(requestId));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/updateStartDate")
    public ResponseEntity<String> updateStartDate(@RequestParam("date") String startDateStr,
                                                  @RequestParam("id") long id) {

        try {

            if(requestUseCase.setNewStartDate(id,startDateStr))
            {
                return ResponseEntity.ok("Date Changed");
            }
            else {
                return ResponseEntity.badRequest().body("Date Not Changed");
            }
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get")
    public ResponseEntity<RequestDto> getRequestById(@RequestParam("id") long id) {

        RequestDto requestDto = requestUseCase.getRequest(id);

        if(requestDto != null){
            return ResponseEntity.ok(requestDto);
        }else return ResponseEntity.notFound().build();


    }

    @GetMapping("/isRendering")
    public ResponseEntity<Boolean> isRequestRendering(@RequestParam("id") long id) {

        return ResponseEntity.ok(requestUseCase.isRequestRendering(id));

    }

    @PostMapping("/confirmCreate")
    public ResponseEntity<?> confirmCreate(@RequestParam long id) {
        try {
            aiPlanUseCase.createNewAiPlanFromRequest(id); // async
            return ResponseEntity.accepted().build(); // HTTP 202
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/countRequestWithoutPlanQuantity")
    public ResponseEntity<Integer> requestWithoutPlanQuantity() {
        return ResponseEntity.ok(requestUseCase.countRequestWithoutPlanQuantity());
    }

    @GetMapping("/countRequestAiToAssign")
    public ResponseEntity<Integer> requestAiToAssign() {
        return ResponseEntity.ok(requestUseCase.countRequestToAssign());
    }

    @GetMapping("/requestAiToAssignList")
    public ResponseEntity<List<RequestOnlyIdDto>> requestAiToAssignList() {

        List<RequestOnlyIdDto> dtoList = requestUseCase.requestAiToAssignList();

        if(dtoList != null){
            return ResponseEntity.ok(dtoList);
        }else return ResponseEntity.badRequest().build();
    }

    @GetMapping("/requestWithoutPlanList")
    public ResponseEntity<List<RequestOnlyIdDto>> requestAiWithoutPlanList() {

        List<RequestOnlyIdDto> dtoList = requestUseCase.requestAiWithoutPlanList();

        if(dtoList != null){
            return ResponseEntity.ok(dtoList);
        }else return ResponseEntity.badRequest().build();
    }

}
