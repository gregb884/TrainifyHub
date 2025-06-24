package org.gregb884.auth.domain.service;

import org.gregb884.auth.domain.model.User;
import org.gregb884.auth.domain.repository.UserRepositoryPort;
import org.gregb884.auth.infrastructure.service.UserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class UserDetailsServiceTest {

    private UserRepositoryPort userRepository;
    private UserDetailsService userDetailsService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepositoryPort.class);
        userDetailsService = new UserDetailsService(userRepository);
    }

    @Test
    void shouldLoadUserByUsername() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("secret");
        user.setRole("ROLE_USER");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        assertThat(userDetails.getUsername()).isEqualTo("testuser");
        assertThat(userDetails.getPassword()).isEqualTo("secret");
        assertThat(userDetails.getAuthorities()).anyMatch(auth -> auth.getAuthority().equals("ROLE_USER"));
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        when(userRepository.findByUsername("notfound")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("notfound"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found");
    }
}