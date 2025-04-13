package org.gregb884.profilemanager.service;

import org.gregb884.profilemanager.dto.TrainerDto;
import org.gregb884.profilemanager.dto.UserAndTrainerDtoForCreate;
import org.gregb884.profilemanager.dto.UserDto;
import org.gregb884.profilemanager.mapper.Mappers;
import org.gregb884.profilemanager.model.Trainer;
import org.gregb884.profilemanager.model.User;
import org.gregb884.profilemanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
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
public class UserService {

    @Value("${location.folder.with.file}")
    private String locationFolder;

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    public String getUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object userIdObj = jwtAuthenticationToken.getTokenAttributes().get("roles");

            if (userIdObj instanceof String) {
                return userIdObj.toString();
            } else {
                throw new IllegalStateException("Unexpected type of id in token: " + userIdObj.getClass().getName());
            }
        }

        throw new IllegalStateException("Authentication token is not a JWT token");
    }

    public boolean saveNewUser(UserAndTrainerDtoForCreate userAndTrainerDtoForCreate) {

        if (userRepository.existsUserByUsername(userAndTrainerDtoForCreate.getUsername())) {

            return false;
        }

        User user = new User();

        user.setUsername(userAndTrainerDtoForCreate.getUsername());
        user.setId(userAndTrainerDtoForCreate.getId());
        user.setFirstName(userAndTrainerDtoForCreate.getFirstName());
        user.setLastName(userAndTrainerDtoForCreate.getLastName());
        user.setRegion(userAndTrainerDtoForCreate.getRegion());

        userRepository.save(user);

        return true;

    }

    public ResponseEntity<User> getMyProfile() {

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            return ResponseEntity.ok(user.get());

        }

        return ResponseEntity.notFound().build();

    }

    public ResponseEntity<String> editMyProfile(UserDto userDto) {

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            userRepository.save(Mappers.toUser(userDto,getUserId()));

            return ResponseEntity.ok("Profile updated successfully");
        }

        return ResponseEntity.notFound().build();


    }

    public String saveProfileImage(MultipartFile file) throws IOException {


        Optional<User> user = userRepository.findById(getUserId());

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

            userRepository.save(user.get());

            return user.get().getImageUrl();
        }

        return null;

    }

    public User getUser(long userId) {

        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {

            return user.get();
        }
        return null;

    }

    public boolean deleteUser() {


        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            userRepository.delete(user.get());

            return true;
        }

        return false;
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

    public Optional<User> getUserByUserName(String userName) {


        return userRepository.findUserByUsername(userName);
    }
}
