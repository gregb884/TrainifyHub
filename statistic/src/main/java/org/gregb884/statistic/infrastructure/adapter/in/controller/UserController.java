package org.gregb884.statistic.infrastructure.adapter.in.controller;
import lombok.RequiredArgsConstructor;
import org.gregb884.statistic.application.dto.UserDto;
import org.gregb884.statistic.application.dto.UserDtoHighlights;
import org.gregb884.statistic.application.port.in.UserHighlightsUseCase;
import org.gregb884.statistic.application.port.in.UserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {


    private final UserUseCase userUseCase;
    private final UserHighlightsUseCase userHighlightsUseCase;


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {


        if(userUseCase.saveNewUser(userDto))
        {
            return ResponseEntity.ok("User created");
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {

        if(userUseCase.deleteUser()){

            return ResponseEntity.ok("User deleted");
        }

        return ResponseEntity.badRequest().build();

    }


    @GetMapping("/getHighlights")
    public ResponseEntity<UserDtoHighlights> getHighLights() {

        return ResponseEntity.ok(userHighlightsUseCase.getHighlights());

    }


}
