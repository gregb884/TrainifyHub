package org.gregb884.statistic.service;
import org.gregb884.statistic.dto.UserDto;
import org.gregb884.statistic.dto.UserDtoHighlights;
import org.gregb884.statistic.mapper.UserMapper;
import org.gregb884.statistic.model.User;
import org.gregb884.statistic.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import java.util.Optional;


@Service
public class UserService {


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

    public boolean saveNewUser(UserDto userDto) {

        if (userRepository.existsUserByUsername(userDto.getUsername())) {

            return false;
        }

        User user = new User();

        user.setUsername(userDto.getUsername());
        user.setId(userDto.getId());

        userRepository.save(user);

        return true;

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
            Object email = jwtAuthenticationToken.getTokenAttributes().get("sub");


            return email.toString();

        } else {

            throw new IllegalStateException("Authentication token is not a JWT token");
        }
    }

    public void setUserRegress(String exerciseName){


        Optional<User> user = userRepository.findById(getUserId());

       if (user.isPresent()) {

           user.get().setRegress(exerciseName);

           userRepository.save(user.get());

       }

    }

    public void setUserProgress(String exerciseName){


        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            user.get().setProgress(exerciseName);

            userRepository.save(user.get());

        }

    }

    public void setUser1Rm(String exerciseName){

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            user.get().setRmProgress(exerciseName);

            userRepository.save(user.get());

        }

    }

    public void setUserNewExercise(String exerciseName){

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            user.get().setExerciseNew(exerciseName);

            userRepository.save(user.get());

        }

    }

    public ResponseEntity<UserDtoHighlights> getHighlights() {


       return ResponseEntity.ok(UserMapper.toDtoHighlights(getUser(getUserId()))) ;

    }
}
