package org.gregb884.profilemanager.controller;
import org.gregb884.profilemanager.dto.TrainerDto;
import org.gregb884.profilemanager.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.model.Trainer;
import org.gregb884.profilemanager.service.TrainerService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile/trainer")
public class TrainerController {



    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserAndTrainerDtoForCreate userAndTrainerDtoForCreate) {


        if(trainerService.saveNewUser(userAndTrainerDtoForCreate))
        {
            return ResponseEntity.ok("User created");
        }
        return ResponseEntity.badRequest().build();
    }


    @GetMapping("/getMyProfile")
    public ResponseEntity<Trainer> getMyProfile() {

        return trainerService.getMyProfile();

    }

    @PostMapping("/editMyProfile")
    public ResponseEntity<String> editMyProfile(@RequestBody TrainerDto trainerDto) {

        return trainerService.editMyProfile(trainerDto);
    }



        @PostMapping("/uploadImage")
        public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {

            try {
                String imageUrl = trainerService.saveProfileImage(file);

                if(imageUrl != null) {

                    Map<String, String> response = new HashMap<>();
                    response.put("imageUrl", imageUrl);
                    return ResponseEntity.ok(response);
                }

                return ResponseEntity.badRequest().build();

            } catch (Exception e) {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }


        @PostMapping("/isPublic")
        public ResponseEntity<Boolean> isPublic() {

               return trainerService.changePublicProfile();
        }


        @GetMapping("/trainerPublicList")
        public ResponseEntity<Page<TrainerDto>> getTrainerPublicListPageView(@RequestParam(defaultValue = "0") int page,
                                                                             @RequestParam(defaultValue = "5") int size,
                                                                             @RequestParam String search) {

            return ResponseEntity.ok(trainerService.getAllPublicTrainer(page,size,search));

        }


        @GetMapping("/trainerProfileView")
        public ResponseEntity<TrainerDto> getTrainerProfileView(@RequestParam(defaultValue = "0") long id) {

            return trainerService.getTrainerProfile(id);

        }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {

        if(trainerService.deleteTrainer()){

            return ResponseEntity.ok("Trainer deleted");
        }

        return ResponseEntity.badRequest().build();

    }


}
