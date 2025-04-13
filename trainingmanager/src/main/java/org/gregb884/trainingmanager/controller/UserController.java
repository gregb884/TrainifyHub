package org.gregb884.trainingmanager.controller;

import org.gregb884.trainingmanager.dto.UserDto;
import org.gregb884.trainingmanager.model.User;
import org.gregb884.trainingmanager.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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


    @GetMapping("/countClient")
    public ResponseEntity<Long> countClient() {

       return userService.countUsers();

    }

    @GetMapping("/myClient")
    public ResponseEntity<List<String>> myClientList() {

        return userService.myClients();

    }



}
