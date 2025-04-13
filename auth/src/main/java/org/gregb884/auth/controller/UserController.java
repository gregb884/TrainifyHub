package org.gregb884.auth.controller;

import org.gregb884.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/exist")
    public ResponseEntity<String> CheckExistUser(@RequestParam String userName) {

        if (userService.checkExist(userName))
        {
            return ResponseEntity.ok("User exist");
        }
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/lang")
    public ResponseEntity<String> CheckLangUser(@RequestParam String userName) {

        String lang = userService.checkLang(userName);

        if (!lang.isEmpty())
        {
            return ResponseEntity.ok(lang);
        }
        else
            return ResponseEntity.notFound().build();
    }


    @GetMapping("/readyPlansAccessCheck")
    public ResponseEntity<String> CheckReadyPlansAccessCheck() {


       return userService.readyPlansAccessCheck();

    }

    @GetMapping("/subscriptionEndDate")
    public ResponseEntity<String> CheckSubscriptionEndDate() {


        return userService.subscriptionEndDate();

    }

    @PostMapping("/consumeAiCoin")
    public ResponseEntity<String> ConsumeAiCoin() {

        return userService.consumeAiCoin();


    }

    @GetMapping("/checkAiCoins")
    public ResponseEntity<String> CheckAiToken() {


        return userService.checkAiCoins();
    }

    @GetMapping("/loginCount")
    public ResponseEntity<String> LoginCount() {

        return userService.loginCount();
    }

    @PostMapping("/loginPlus")
    public ResponseEntity<Void> LoginPlus() {

        return userService.loginPlus();

    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> deleteAccount() {

        return userService.deleteMyAccount();

    }

}
