package org.gregb884.auth.application.port.out;


public interface AppleTokenVerifierPort {

    String verify(String token) throws Exception;

}