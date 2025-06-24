package org.gregb884.profilemanager.infrastructure.adapter.in.controller;
import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.dto.TrainerDto;
import org.gregb884.profilemanager.application.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.application.port.in.ProfileImageUseCase;
import org.gregb884.profilemanager.application.port.in.PublicQueryTrainerUseCase;
import org.gregb884.profilemanager.application.port.in.TrainerProfileUseCase;
import org.gregb884.profilemanager.domain.model.Trainer;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profile/trainer")
public class TrainerController {


        private final ProfileImageUseCase profileImageUseCase;
        private final TrainerProfileUseCase trainerProfileUseCase;
        private final PublicQueryTrainerUseCase publicQueryTrainerUseCase;

        @PostMapping("/create")
        public ResponseEntity<String> createUser(@RequestBody UserAndTrainerDtoForCreate userAndTrainerDtoForCreate) {


            if(trainerProfileUseCase.saveNewUser(userAndTrainerDtoForCreate))
            {
                return ResponseEntity.ok("User created");
            }
            return ResponseEntity.badRequest().build();
        }


        @GetMapping("/getMyProfile")
        public ResponseEntity<Trainer> getMyProfile() {

            Optional<Trainer> trainer = trainerProfileUseCase.getMyProfileTrainer();

            return trainer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

        }

        @PostMapping("/editMyProfile")
        public ResponseEntity<String> editMyProfile(@RequestBody TrainerDto trainerDto) {

            try {
                trainerProfileUseCase.editMyProfile(trainerDto);
                return ResponseEntity.ok("Successfully edited user");
            } catch (Exception e){
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }



        @PostMapping("/uploadImage")
        public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {

            try {
                String imageUrl = profileImageUseCase.saveProfileImage(file);

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

               return ResponseEntity.ok(trainerProfileUseCase.changePublicProfile());
        }


        @GetMapping("/trainerPublicList")
        public ResponseEntity<Page<TrainerDto>> getTrainerPublicListPageView(@RequestParam(defaultValue = "0") int page,
                                                                             @RequestParam(defaultValue = "5") int size,
                                                                             @RequestParam String search) {

            return ResponseEntity.ok(publicQueryTrainerUseCase.getAllPublicTrainer(page,size,search));

        }


        @GetMapping("/trainerProfileView")
        public ResponseEntity<TrainerDto> getTrainerProfileView(@RequestParam(defaultValue = "0") long id) {

            TrainerDto trainerDto =  publicQueryTrainerUseCase.getTrainerProfile(id);

            if(trainerDto != null) {
                return ResponseEntity.ok(trainerDto);
            } else return ResponseEntity.notFound().build();

        }

        @DeleteMapping("/delete")
        public ResponseEntity<String> deleteUser() {

            if(trainerProfileUseCase.deleteTrainer()){

                return ResponseEntity.ok("Trainer deleted");
            }

            return ResponseEntity.badRequest().build();

        }


}
