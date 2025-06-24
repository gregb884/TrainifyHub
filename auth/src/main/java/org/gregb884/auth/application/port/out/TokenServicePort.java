package org.gregb884.auth.application.port.out;

import org.gregb884.auth.domain.model.User;

public interface TokenServicePort {
    String generateToken(User user);
}