package org.gregb884.notification.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.notification.application.port.in.FcmTokenUseCase;
import org.gregb884.notification.domain.model.User;
import org.gregb884.notification.domain.repository.UserRepositoryPort;
import org.gregb884.notification.infrastructure.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FcmTokenService implements FcmTokenUseCase {


    private final UserRepositoryPort userRepository;
    private final AuthenticatedUser authenticatedUser;


    @Override
    public void addFcmToken(String fcmToken) throws Exception {
        Optional<User> optionalUser = userRepository.findById(authenticatedUser.getUserId());

        if (optionalUser.isEmpty()) {
            throw new Exception("User not found");
        }

        User currentUser = optionalUser.get();

        if (Objects.equals(fcmToken, currentUser.getFcmToken())) {
            return;
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

    }

    @Override
    public String getFcm() throws Exception {


        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {
            if (user.get().getFcmToken() != null) {

                return user.get().getFcmToken();
            }
            throw new Exception("FCM token not found");
        }
        throw new Exception("User not found");

    }

    @Override
    public void deleteFCM() throws Exception {

        Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

        if (user.isPresent()) {
            user.get().setFcmToken(null);
            userRepository.save(user.get());
        } else throw new  Exception("User not found");

    }


}
