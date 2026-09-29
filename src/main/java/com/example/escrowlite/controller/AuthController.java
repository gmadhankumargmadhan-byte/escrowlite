package com.example.escrowlite.controller;

import com.example.escrowlite.dto.AuthResponse;
import com.example.escrowlite.dto.LoginRequest;
import com.example.escrowlite.dto.RegisterRequest;
import com.example.escrowlite.entity.User;
import com.example.escrowlite.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @GetMapping("/me")
    public User getCurrentUser(@RequestParam(required = false, defaultValue = "admin") String username) {
        return authService.getProfile(username);
    }
}
