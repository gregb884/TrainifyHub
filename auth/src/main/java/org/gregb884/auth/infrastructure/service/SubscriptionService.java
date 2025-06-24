package org.gregb884.auth.infrastructure.service;

import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Optional;

@Service
public class SubscriptionService {

    private final UserRepositoryPort userRepository;
    private final AuthenticatedUser authenticatedUser;

    public SubscriptionService(UserRepositoryPort userRepository, AuthenticatedUser authenticatedUser) {
        this.userRepository = userRepository;
        this.authenticatedUser = authenticatedUser;
    }


    public boolean changeTimeExpireSubscription(Long expiryTimeMillis, String zone) {

        try {

            Optional<User> user = userRepository.findById(authenticatedUser.getUserId());

            if (user.isPresent()) {

                Instant expiryInstant = Instant.ofEpochMilli(expiryTimeMillis);

                ZoneId zoneId = (zone != null && !zone.isEmpty()) ? ZoneId.of(zone) : ZoneId.of("UTC");

                ZonedDateTime expiryDateTimeUser = expiryInstant.atZone(zoneId);

                Date expiryDate = Date.from(expiryDateTimeUser.toInstant());

                user.get().setReadyMadePlansAccess(expiryDate);

                userRepository.save(user.get());

                return true;

            }

        } catch (Exception e){

            return false;

        }

        return false;

    }

}
