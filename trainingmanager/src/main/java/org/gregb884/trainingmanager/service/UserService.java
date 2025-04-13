package org.gregb884.trainingmanager.service;

import jakarta.transaction.Transactional;
import org.gregb884.trainingmanager.dto.UserDto;
import org.gregb884.trainingmanager.model.User;
import org.gregb884.trainingmanager.repository.TrainingPlanRepository;
import org.gregb884.trainingmanager.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final TrainingPlanRepository trainingPlanRepository;

    public UserService(UserRepository userRepository, TrainingPlanRepository trainingPlanRepository) {
        this.userRepository = userRepository;
        this.trainingPlanRepository = trainingPlanRepository;
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
                throw  new IllegalStateException("Unexpected type of id in token: " + userIdObj.getClass().getName());
            }
        }

        throw new IllegalStateException("Authentication token is not a JWT token");
    }

    public String getUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object userName = jwtAuthenticationToken.getTokenAttributes().get("firstName");
            Object lastName = jwtAuthenticationToken.getTokenAttributes().get("lastName");


                return userName.toString() + " " + lastName.toString();

        } else {

            throw new IllegalStateException("Authentication token is not a JWT token");
        }
    }

    public String getUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object userEmail = jwtAuthenticationToken.getTokenAttributes().get("sub");


            return userEmail.toString();

        } else {

            throw new IllegalStateException("Authentication token is not a JWT token");
        }
    }

    public String getUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object userRole = jwtAuthenticationToken.getTokenAttributes().get("roles");

            return userRole.toString();

        } else {

            throw new IllegalStateException("Authentication token is not a JWT token");
        }
    }



    public ResponseEntity<Long> countUsers() {


        long sumUsers = trainingPlanRepository.countDistinctUserIdsByCreatorIdOrUserId(getUserId());

        return ResponseEntity.ok(sumUsers);

    }

    public ResponseEntity<List<String>> myClients() {

        List<String> sumUsers = trainingPlanRepository.findDistinctUsernamesByCreatorIdOrUserId(getUserId());

        sumUsers.remove(sumUsers.equals(getUserId()) ? 1 : 0);

        return ResponseEntity.ok(sumUsers);
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

    public Set<User> findByUserName(String email) {

        Set<User> users = new HashSet<>();
       User user = userRepository.findByUsername(email);
        users.add(user);
        return users;
    }

    public User findById(long id) {

        return userRepository.findById(id).orElse(null);
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
}
