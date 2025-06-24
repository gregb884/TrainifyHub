package org.gregb884.auth.infrastructure.adapter.in.controller;
import org.gregb884.auth.application.dto.ResponseDto;
import org.gregb884.auth.application.port.in.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserDataController {

    private final UserAccountUseCase userAccountUseCase;
    private final AiCoinUseCase aiCoinUseCase;

    public UserDataController(UserAccountUseCase userAccountUseCase, AiCoinUseCase aiCoinUseCase) {
        this.userAccountUseCase = userAccountUseCase;
        this.aiCoinUseCase = aiCoinUseCase;
    }

    @GetMapping("/exist")
    public ResponseEntity<String> CheckExistUser(@RequestParam String userName) {
        if (userAccountUseCase.checkExist(userName)) {
            return ResponseEntity.ok("User exist");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/lang")
    public ResponseEntity<String> CheckLangUser(@RequestParam String userName) {
        String lang = userAccountUseCase.checkLang(userName);
        if (!lang.isEmpty()) {
            return ResponseEntity.ok(lang);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/readyPlansAccessCheck")
    public ResponseEntity<String> CheckReadyPlansAccessCheck() {

        ResponseDto planCheckDto = userAccountUseCase.readyPlansAccessCheck();

        if(planCheckDto.getResponse().equals("Access")) return ResponseEntity.ok("Access");
        else return ResponseEntity.badRequest().body(planCheckDto.getResponse());
    }

    @GetMapping("/subscriptionEndDate")
    public ResponseEntity<String> CheckSubscriptionEndDate() {

        ResponseDto responseDto = userAccountUseCase.subscriptionEndDate();

        if (responseDto.getResponse().equals("Null")) return ResponseEntity.badRequest().body(responseDto.getResponse());
        else return ResponseEntity.ok(responseDto.getResponse());
    }

    @PostMapping("/consumeAiCoin")
    public ResponseEntity<String> ConsumeAiCoin() {

        if (aiCoinUseCase.consumeAiCoin()){

           return ResponseEntity.ok("Consumed");
        }

        return ResponseEntity.badRequest().body("Not consumed");
    }

    @GetMapping("/checkAiCoins")
    public ResponseEntity<Integer> CheckAiToken() {

        return ResponseEntity.ok(aiCoinUseCase.checkAiCoins());

    }

    @GetMapping("/loginCount")
    public ResponseEntity<String> LoginCount() {

        return  ResponseEntity.ok(userAccountUseCase.loginCount().toString());
    }

    @PostMapping("/loginPlus")
    public ResponseEntity<Void> LoginPlus() {

        userAccountUseCase.loginPlus();

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteAccount() {

        ResponseDto responseDto = userAccountUseCase.deleteMyAccount();

        if (responseDto.getResponse().equals("Deleted")) return ResponseEntity.ok("Deleted");
        else return ResponseEntity.badRequest().body(responseDto.getResponse());
    }
}