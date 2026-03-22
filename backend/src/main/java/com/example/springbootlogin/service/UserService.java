package com.example.springbootlogin.service;

import com.example.springbootlogin.dto.AuthResponse;
import com.example.springbootlogin.dto.LoginRequest;
import com.example.springbootlogin.dto.RegisterRequest;
import com.example.springbootlogin.model.User;
import com.example.springbootlogin.repository.UserRepository;
import com.example.springbootlogin.security.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @SuppressWarnings("null")
    public AuthResponse register(RegisterRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank() ||
                request.getFullName() == null || request.getFullName().isBlank()) {
            return new AuthResponse("Invalid registration payload", null, null, null);
        }

        String email = request.getEmail().strip();
        String fullName = request.getFullName().strip();
        String password = request.getPassword();

        if (userRepository.existsByEmail(email)) {
            log.warn("Attempt to register existing email={}", email);
            return new AuthResponse("Mail already registered", null, null, null);
        }

        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .createdAt(Instant.now().toString())
                .enabled(true)
                .failedLoginAttempts(0)
                .build();

        User saved = java.util.Objects.requireNonNull(userRepository.save(user));
        cacheEvictUser(saved.getEmail());
        String token = jwtTokenUtil.generateToken(saved.getEmail());
        log.info("User registered email={}", saved.getEmail());

        return new AuthResponse("Registered successfully", token, saved.getFullName(), saved.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {
            return new AuthResponse("Invalid login payload", null, null, null);
        }

        Optional<User> userOpt = findByEmail(request.getEmail().strip());
        if (userOpt.isEmpty()) {
            log.warn("Invalid login attempt for email={}", request.getEmail());
            return new AuthResponse("Invalid email/password", null, null, null);
        }

        User user = userOpt.get();

        if (user.getLockUntil() != null && !user.getLockUntil().isEmpty()) {
            try {
                LocalDateTime lockUntilTime = LocalDateTime.parse(user.getLockUntil(), DateTimeFormatter.ISO_DATE_TIME);
                if (lockUntilTime.isAfter(LocalDateTime.now())) {
                    return new AuthResponse("Account locked until " + lockUntilTime + ". Try later.", null, null, null);
                }
            } catch (Exception e) {
                // corrupt value: reset lock and continue
            }
            user.setLockUntil(null);
            user.setFailedLoginAttempts(0);
        }

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
            String token = jwtTokenUtil.generateToken(user.getEmail());
            log.info("Login success for email={}", user.getEmail());
            return new AuthResponse("Login successful", token, user.getFullName(), user.getEmail());
        }

        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);
        if (attempts >= 5) {
            user.setLockUntil(LocalDateTime.now().plusMinutes(15).format(DateTimeFormatter.ISO_DATE_TIME));
            userRepository.save(user);
            return new AuthResponse("Too many failed attempts. Account locked 15 minutes.", null, null, null);
        }

        userRepository.save(user);
        log.warn("Failed login attempt #{} for email={}", attempts, user.getEmail());
        return new AuthResponse("Invalid email/password. " + (5 - attempts) + " attempts left.", null, null, null);
    }

    @Cacheable(value = "users", key = "#email")
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @CacheEvict(value = "users", key = "#email")
    public void cacheEvictUser(String email) {
        // evict cache, called on register/update events
    }
}
