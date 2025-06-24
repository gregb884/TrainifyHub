package org.gregb884.auth.application.port.in;

public interface ActivationUseCase {

    boolean activateAccount(String token);
}