package org.gregb884.notification.service;

import org.gregb884.notification.dto.UserDto;
import org.gregb884.notification.model.User;
import org.gregb884.notification.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public boolean saveNewUser(UserDto userDto) {

        if (userRepository.existsUserByUsername(userDto.getUsername())) {

            return false;
        }

        User user1 = new User();

        user1.setUsername(userDto.getUsername());
        user1.setId(userDto.getId());

        userRepository.save(user1);

        return true;

    }

    public User getUserByEmail(String email) {

       return userRepository.findByUsername(email);
    }

    public Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication: " + authentication);

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            System.out.println("Token attributes: " + jwtAuthenticationToken.getTokenAttributes());
            Object userIdObj = jwtAuthenticationToken.getTokenAttributes().get("id");
            System.out.println("User ID object: " + userIdObj);

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


    public boolean deleteUser() {

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            userRepository.delete(user.get());

            return true;
        }

        return false;

    }

    public ResponseEntity<Void> addFcmToken(String fcmToken) {
        Optional<User> optionalUser = userRepository.findById(getUserId());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User currentUser = optionalUser.get();

        if (Objects.equals(fcmToken, currentUser.getFcmToken())) {
            return ResponseEntity.ok().build();
        }


        List<User> usersWithToken = userRepository.findUsersByFcmToken(fcmToken);

        for (User otherUser : usersWithToken) {
            if (Long.compare(otherUser.getId(), currentUser.getId()) != 0) {
                otherUser.setFcmToken(null);
                userRepository.save(otherUser);
            }
        }

        currentUser.setFcmToken(fcmToken);
        userRepository.save(currentUser);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<String> getFcm() {


        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {
            if (user.get().getFcmToken() != null) {

                return ResponseEntity.ok(user.get().getFcmToken());
            }
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.badRequest().build();

    }

    public ResponseEntity<String> deleteFCM() {

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            user.get().setFcmToken(null);
            userRepository.save(user.get());
        }

        return ResponseEntity.ok().build();

    }
}
