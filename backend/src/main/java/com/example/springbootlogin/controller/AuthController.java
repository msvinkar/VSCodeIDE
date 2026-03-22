package com.example.springbootlogin.controller;

import com.example.springbootlogin.dto.AuthResponse;
import com.example.springbootlogin.dto.LoginRequest;
import com.example.springbootlogin.dto.RegisterRequest;
import com.example.springbootlogin.security.RedisRateLimiter;
import com.example.springbootlogin.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class AuthController {

    private final UserService userService;
    private final RedisRateLimiter redisRateLimiter;

    public AuthController(UserService userService, RedisRateLimiter redisRateLimiter) {
        this.userService = userService;
        this.redisRateLimiter = redisRateLimiter;
    }

    private boolean checkRateLimit(HttpServletRequest request) {
        if (request == null) {
            log.warn("Rate limit check with null request");
            return false;
        }
        String key = request.getRemoteAddr();
        if (key == null || key.isBlank()) {
            log.warn("Rate limit check with blank remoteAddr");
            key = "unknown";
        }
        return redisRateLimiter.tryConsume(key);
    }

    private ResponseEntity<AuthResponse> rateLimitExceeded(String context) {
        log.warn("Rate limit exceeded for {}", context);
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(new AuthResponse("Too many requests", null, null, null));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        if (!checkRateLimit(httpRequest)) {
            return rateLimitExceeded("register");
        }

        AuthResponse response = userService.register(request);
        if (response.getToken() == null && response.getMessage().contains("already")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        if (!checkRateLimit(httpRequest)) {
            return rateLimitExceeded("login");
        }

        AuthResponse response = userService.login(request);
        if (response.getToken() == null) {
            return ResponseEntity.status(401).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("logged out");
    }
}

