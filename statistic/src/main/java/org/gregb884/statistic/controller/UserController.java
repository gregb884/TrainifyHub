package org.gregb884.statistic.controller;
import org.gregb884.statistic.dto.UserDto;
import org.gregb884.statistic.dto.UserDtoHighlights;
import org.gregb884.statistic.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {


        if(userService.saveNewUser(userDto))
        {
            return ResponseEntity.ok("User created");
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {

        if(userService.deleteUser()){

            return ResponseEntity.ok("User deleted");
        }

        return ResponseEntity.badRequest().build();

    }


    @GetMapping("/getHighlights")
    public ResponseEntity<UserDtoHighlights> getHighLights() {


        return userService.getHighlights();

    }


}
