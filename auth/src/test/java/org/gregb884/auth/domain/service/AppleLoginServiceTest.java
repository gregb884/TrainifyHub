package org.gregb884.auth.domain.service;

import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.gregb884.auth.infrastructure.service.AppleLoginService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AppleLoginServiceTest {

    private AppleLoginService service;

    private final String expectedIssuer = "https://appleid.apple.com";
    private final String expectedClientId = "gregb884.TrainifyHub";

    @BeforeEach
    void setUp() {
        service = new AppleLoginService();
    }

    @Test
    void shouldReturnEmailWhenTokenIsValid() throws Exception {
        String token = "eyJhbGciOiJSUzI1NiJ9." +
                "eyJpc3MiOiAiaHR0cHM6Ly9hcHBsZWlkLmFwcGxlLmNvbSIsICJhdWQiOiAiZ3JlZ2I4ODQuVHJhaW5pZnlIdWIiLCAiZW1haWwiOiAidGVzdEBleGFtcGxlLmNvbSJ9." +
                "signature";

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer(expectedIssuer)
                .audience(List.of(expectedClientId))
                .claim("email", "test@example.com")
                .build();

        SignedJWT mockJwt = mock(SignedJWT.class);
        when(mockJwt.verify(any(JWSVerifier.class))).thenReturn(true);
        when(mockJwt.getJWTClaimsSet()).thenReturn(claims);
        when(mockJwt.getHeader()).thenReturn(new JWSHeader.Builder(JWSHeader.parse("{\"alg\":\"RS256\"}")).build());

        try (MockedStatic<SignedJWT> mocked = mockStatic(SignedJWT.class)) {
            mocked.when(() -> SignedJWT.parse(token)).thenReturn(mockJwt);

            String email = service.verify(token);

            assertThat(email).isEqualTo("test@example.com");
        }
    }

    @Test
    void shouldThrowExceptionForInvalidIssuer() throws Exception {
        String token = "eyJhbGciOiJSUzI1NiJ9." +
                "eyJpc3MiOiAiaW52YWxpZC1pc3N1ZXIiLCAiYXVkIjogImdyZWdiODg0LlRyYWluaWZ5SHViIiwgImVtYWlsIjogInRlc3RAZXhhbXBsZS5jb20ifQ." +
                "signature";

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer("invalid-issuer")
                .audience(List.of(expectedClientId))
                .claim("email", "test@example.com")
                .build();

        SignedJWT mockJwt = mock(SignedJWT.class);
        when(mockJwt.verify(any())).thenReturn(true);
        when(mockJwt.getJWTClaimsSet()).thenReturn(claims);
        when(mockJwt.getHeader()).thenReturn(new JWSHeader.Builder(JWSHeader.parse("{\"alg\":\"RS256\"}")).build());

        try (MockedStatic<SignedJWT> mocked = mockStatic(SignedJWT.class)) {
            mocked.when(() -> SignedJWT.parse(token)).thenReturn(mockJwt);

            assertThatThrownBy(() -> service.verify(token))
                    .isInstanceOf(Exception.class)
                    .hasMessageContaining("Invalid issuer");
        }
    }

    @Test
    void shouldThrowExceptionForInvalidClientId() throws Exception {
        String token = "eyJhbGciOiJSUzI1NiJ9." +
                "eyJpc3MiOiAiaHR0cHM6Ly9hcHBsZWlkLmFwcGxlLmNvbSIsICJhdWQiOiAiaW52YWxpZC1jbGllbnQiLCAiZW1haWwiOiAidGVzdEBleGFtcGxlLmNvbSJ9." +
                "signature";

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer(expectedIssuer)
                .audience(List.of("invalid-client"))
                .claim("email", "test@example.com")
                .build();

        SignedJWT mockJwt = mock(SignedJWT.class);
        when(mockJwt.verify(any())).thenReturn(true);
        when(mockJwt.getJWTClaimsSet()).thenReturn(claims);
        when(mockJwt.getHeader()).thenReturn(new JWSHeader.Builder(JWSHeader.parse("{\"alg\":\"RS256\"}")).build());

        try (MockedStatic<SignedJWT> mocked = mockStatic(SignedJWT.class)) {
            mocked.when(() -> SignedJWT.parse(token)).thenReturn(mockJwt);

            assertThatThrownBy(() -> service.verify(token))
                    .isInstanceOf(Exception.class)
                    .hasMessageContaining("Invalid client id");
        }
    }
}