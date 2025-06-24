package org.gregb884.auth.domain.service;

import org.gregb884.auth.infrastructure.service.UserDataService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collections;

import static org.assertj.core.api.Assertions.*;

class UserDataServiceTest {

    private UserDataService userDataService;

    @BeforeEach
    void setUp() {
        userDataService = new UserDataService();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldReturnUsernameFromJwt() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claims(claims -> claims.put("sub", "testUser"))
                .build();

        JwtAuthenticationToken token = new JwtAuthenticationToken(jwt, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(token);

        String result = userDataService.getUserName();
        assertThat(result).isEqualTo("testUser");
    }

    @Test
    void shouldReturnLanguageFromJwt() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claims(claims -> claims.put("lang", "pl"))
                .build();

        JwtAuthenticationToken token = new JwtAuthenticationToken(jwt, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(token);

        String result = userDataService.getLang();
        assertThat(result).isEqualTo("pl");
    }

    @Test
    void shouldThrowWhenTokenIsNotJwt() {
        SecurityContextHolder.getContext().setAuthentication(null);

        assertThatThrownBy(() -> userDataService.getUserName())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Authentication token is not a JWT token");
    }

    @Test
    void shouldThrowWhenSubClaimIsWrongType() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claims(claims -> claims.put("sub", 12345)) // wrong type
                .build();

        JwtAuthenticationToken token = new JwtAuthenticationToken(jwt, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(token);

        assertThatThrownBy(() -> userDataService.getUserName())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Unexpected type of id in token");
    }

    @Test
    void shouldThrowWhenLangClaimIsWrongType() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claims(claims -> claims.put("lang", 12345)) // wrong type
                .build();

        JwtAuthenticationToken token = new JwtAuthenticationToken(jwt, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(token);

        assertThatThrownBy(() -> userDataService.getLang())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Unexpected type of id in token");
    }
}