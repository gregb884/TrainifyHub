package org.gregb884.auth.infrastructure.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.gregb884.auth.application.port.out.TokenServicePort;
import org.gregb884.auth.domain.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenService implements TokenServicePort {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtTokenService(SecretKey secretKey, @Value("${jwt.expiration}") long expiration) {
        this.secretKey = secretKey;
        this.expiration = expiration;
    }

    @Override
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", "ROLE_" + user.getRole());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        claims.put("premium", user.isPremium());
        claims.put("verified", user.isVerified());
        claims.put("id", user.getId());
        claims.put("lang", user.getLang());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
}