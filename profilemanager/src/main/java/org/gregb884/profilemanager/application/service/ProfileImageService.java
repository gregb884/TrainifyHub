package org.gregb884.profilemanager.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.port.in.ProfileImageUseCase;
import org.gregb884.profilemanager.application.port.in.TrainerProfileUseCase;
import org.gregb884.profilemanager.application.port.in.UserProfileUseCase;
import org.gregb884.profilemanager.domain.model.Trainer;
import org.gregb884.profilemanager.domain.model.User;
import org.gregb884.profilemanager.infrastructure.security.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileImageService implements ProfileImageUseCase {

    @Value("${location.folder.with.file}")
    private String locationFolder;


    private final UserProfileUseCase userProfileUseCase;
    private final TrainerProfileUseCase trainerProfileUseCase;
    private final AuthenticatedUser authenticatedUser;


    @Override
    public String getUserOrTrainerImage(String userName) throws Exception {

        Optional<User> user = userProfileUseCase.getUserByUsername(userName);
        Optional<Trainer> trainer = trainerProfileUseCase.getMyProfileTrainer();

        if (user.isPresent()) {

            return user.get().getImageUrl();
        }

        if (trainer.isPresent()) {

            return trainer.get().getImageUrl();
        }

        throw new Exception("User not found");

    }


    @Override
    public String saveProfileImage(MultipartFile file) throws Exception {

        String userImageUrl = "";
        Optional<User> user = userProfileUseCase.getUserByUsername(authenticatedUser.getEmail());
        Optional<Trainer> trainerProfile = trainerProfileUseCase.getMyProfileTrainer();

        if (trainerProfile.isEmpty() && user.isEmpty()) {
            throw new Exception("User not found");
        }

            if (trainerProfile.isPresent()) {
                userImageUrl = trainerProfile.get().getImageUrl();
            }

            if (user.isPresent()) {
                userImageUrl = user.get().getImageUrl();
            }


            String folder = locationFolder.replace("file:", "");


            if (userImageUrl != null && !userImageUrl.isEmpty()) {
                String oldFileName = userImageUrl.substring(userImageUrl.lastIndexOf("/") + 1);
                Path oldFilePath = Paths.get(folder + oldFileName);
                Files.deleteIfExists(oldFilePath);
            }


            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(folder + fileName);

            Files.createDirectories(path.getParent());

            Files.write(path, file.getBytes());

            userImageUrl = "/uploads/" + fileName;


        if (trainerProfile.isPresent()) {
            trainerProfileUseCase.setNewImageUrl(userImageUrl);
        }

        if (user.isPresent()) {
            userProfileUseCase.setNewImageUrl(userImageUrl);
        }

        return userImageUrl;

    }

}
