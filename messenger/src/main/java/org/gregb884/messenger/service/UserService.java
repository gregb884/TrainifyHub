package org.gregb884.messenger.service;

import org.gregb884.messenger.dto.UserDto;
import org.gregb884.messenger.model.User;
import org.gregb884.messenger.repository.UserRepository;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;
import java.util.Optional;

@Service
public class UserService {


    private static final String PROFILE_URL = "http://PROFILEMANAGER/api/profileImage/get";
    private static final String AUTH_URL = "http://AUTH/api/users/lang";
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;


    public UserService(UserRepository userRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }


    public String getUserName(Principal principal) {
        if (principal instanceof Authentication) {
            Authentication authentication = (Authentication) principal;
            if (authentication.getPrincipal() instanceof Jwt) {
                Jwt jwt = (Jwt) authentication.getPrincipal();
                String username = (String) jwt.getClaim("sub");
                return username;
            }
        }
        throw new IllegalStateException("Principal is not a JWT token");
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


    public boolean saveNewUser(UserDto userDto) {

        if (userRepository.existsUserByUsername(userDto.getUsername())) {

            return false;
        }

        User user1 = new User();

        user1.setUsername(userDto.getUsername());
        user1.setFirstName(userDto.getFirstName());
        user1.setLastName(userDto.getLastName());
        user1.setId(userDto.getId());

        userRepository.save(user1);

        return true;

    }

    public boolean deleteUser() {

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            userRepository.delete(user.get());

            return true;

        }

        return false;
    }


    public String getImgUrlForUser(String userName) {

        Optional<User> user =  userRepository.findByUsername(userName);

        if (user.isPresent()) {

            try {

                ResponseEntity<String> response = restTemplate.exchange(
                        PROFILE_URL + "?userName=" + userName,
                        HttpMethod.GET,
                        null,
                        String.class
                );

                return response.getBody();


            } catch (Exception e) {

                e.getMessage();

            }

            return user.get().getImageUrl();
        }

        return null;
    }

    public String getLang(String userName) {

        try {

            ResponseEntity<String> response = restTemplate.exchange(
                    AUTH_URL + "?userName=" + userName,
                    HttpMethod.GET,
                    null,
                    String.class
            );

            return response.getBody();


        } catch (Exception e) {

            e.getMessage();

        }

        return "";
    }
}
