package org.gregb884.auth.infrastructure.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.stream.Collectors;

@Component
public class AuthenticatedUser {

    public Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwt) {
            Object userIdObj = jwt.getTokenAttributes().get("id");

            if (userIdObj instanceof Integer) return ((Integer) userIdObj).longValue();
            if (userIdObj instanceof Long) return (Long) userIdObj;
            if (userIdObj instanceof String) return Long.parseLong((String) userIdObj);
            throw new IllegalStateException("Unexpected type of id in token: " + userIdObj.getClass().getName());
        }

        throw new IllegalStateException("Authentication token is not a JWT token");
    }

    public String getRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new IllegalStateException("No authentication information found");
        }


        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object roleObj = jwtAuthenticationToken.getTokenAttributes().get("roles");

            if (roleObj instanceof String) {
                return (String) roleObj;
            } else {
                throw new IllegalStateException("Unexpected type of roles in token: " + roleObj.getClass().getName());
            }
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        if (roles.contains("TRAINER")) {
            return "TRAINER";
        } else {
            throw new IllegalStateException("User does not have the required role");
        }
    }
}