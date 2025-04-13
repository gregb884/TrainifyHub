package org.gregb884.profilemanager.service;

import org.gregb884.profilemanager.dto.TrainerDto;
import org.gregb884.profilemanager.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.mapper.Mappers;
import org.gregb884.profilemanager.model.Trainer;
import org.gregb884.profilemanager.model.User;
import org.gregb884.profilemanager.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class TrainerService {

    @Value("${location.folder.with.file}")
    private String locationFolder;

    private final TrainerRepository trainerRepository;

    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }


    public Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object userIdObj = jwtAuthenticationToken.getTokenAttributes().get("id");

            if (userIdObj instanceof Integer) {
                return ((Integer) userIdObj).longValue();
            } else if (userIdObj instanceof Long) {
                return (Long) userIdObj;
            } else if (userIdObj instanceof String) {
                return Long.valueOf((String) userIdObj);
            } else {
                throw new IllegalStateException("Unexpected type of id in token: " + userIdObj.getClass().getName());
            }
        }

        throw new IllegalStateException("Authentication token is not a JWT token");
    }

    public String getLang() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object lang = jwtAuthenticationToken.getTokenAttributes().get("lang");


            return lang.toString();

        } else {

            return "";
        }

    }


    public boolean saveNewUser(UserAndTrainerDtoForCreate userAndTrainerDtoForCreate) {

        if (trainerRepository.existsUserByUsername(userAndTrainerDtoForCreate.getUsername())) {

            return false;
        }

        Trainer trainer1 = new Trainer();

        trainer1.setUsername(userAndTrainerDtoForCreate.getUsername());
        trainer1.setId(userAndTrainerDtoForCreate.getId());
        trainer1.setFirstName(userAndTrainerDtoForCreate.getFirstName());
        trainer1.setLastName(userAndTrainerDtoForCreate.getLastName());
        trainer1.setRegion(userAndTrainerDtoForCreate.getRegion());
        trainer1.setIsPublic(false);

        trainerRepository.save(trainer1);

        return true;

    }

    public ResponseEntity<Trainer> getMyProfile() {

        Optional<Trainer> user = trainerRepository.findById(getUserId());

        if (user.isPresent()) {

            return ResponseEntity.ok(user.get());
        }

        else return ResponseEntity.notFound().build();
    }


    public ResponseEntity<String> editMyProfile(TrainerDto trainerDto) {

        Optional<Trainer> user = trainerRepository.findById(getUserId());



        if (user.isPresent()) {


            trainerRepository.save(Mappers.toTrainer(trainerDto,user.get().getId(),user.get().isIsPublic()));

            return ResponseEntity.ok("Successfully edited user");
        }

        else return ResponseEntity.notFound().build();

    }

    public String saveProfileImage(MultipartFile file) throws IOException {
        Optional<Trainer> user = trainerRepository.findById(getUserId());

        if (user.isPresent()) {

            String folder = locationFolder.replace("file:", "");

            String oldImageUrl = user.get().getImageUrl();
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                String oldFileName = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);
                Path oldFilePath = Paths.get(folder + oldFileName);
                Files.deleteIfExists(oldFilePath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(folder + fileName);

            Files.createDirectories(path.getParent());

            Files.write(path, file.getBytes());

            String imageUrl = "/uploads/" + fileName;
            user.get().setImageUrl(imageUrl);

            trainerRepository.save(user.get());

            return user.get().getImageUrl();
        }

        return null;
    }

    public ResponseEntity<Boolean> changePublicProfile() {


        Optional<Trainer> user = trainerRepository.findById(getUserId());

        if (user.isPresent()) {

            if (user.get().isIsPublic()){

                user.get().setIsPublic(false);
                trainerRepository.save(user.get());

                return ResponseEntity.ok(false);
            }

                user.get().setIsPublic(true);
                trainerRepository.save(user.get());

                return ResponseEntity.ok(true);

        }

        return ResponseEntity.notFound().build();
    }



    public Page<TrainerDto> getAllPublicTrainer(int page, int size, String search) {


        String searchToLowerCase = search.toLowerCase();

        Pageable pageable = PageRequest.of(page, size);

        Page<Trainer> trainerPage = trainerRepository.findAllByIsPublic(searchToLowerCase,pageable, getLang());

        return trainerPage.map(Mappers::toTrainerDto);

    }

    public ResponseEntity<TrainerDto> getTrainerProfile(long id) {


        Optional<Trainer> trainer = trainerRepository.findByIdAndIsPublicTrue(id);

        if (trainer.isPresent()) {


            return ResponseEntity.ok(Mappers.toTrainerDto(trainer.get()));
        }

        return ResponseEntity.notFound().build();

    }

    public Trainer getTrainer(long id) {

        Optional<Trainer> trainer = trainerRepository.findByIdAndIsPublicTrue(id);
        if (trainer.isPresent()) {
            return trainer.get();
        }
        return null;
    }


    public Optional<Trainer> getTrainerByUserName(String userName) {

        return trainerRepository.findByUsername(userName);

    }

    public boolean deleteTrainer() {

        Optional<Trainer> trainer = trainerRepository.findById(getUserId());

        if (trainer.isPresent()) {

            trainerRepository.delete(trainer.get());

            return true;
        }

        return false;
    }
}
