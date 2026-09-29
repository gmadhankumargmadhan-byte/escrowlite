package com.example.escrowlite.service;

import com.example.escrowlite.dto.AuthResponse;
import com.example.escrowlite.dto.LoginRequest;
import com.example.escrowlite.dto.RegisterRequest;
import com.example.escrowlite.entity.User;
import com.example.escrowlite.exception.BusinessRuleException;
import com.example.escrowlite.exception.ResourceNotFoundException;
import com.example.escrowlite.repository.UserRepository;
import com.example.escrowlite.util.PasswordUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.username)) {
            throw new BusinessRuleException("Username is already taken.");
        }
        if (userRepository.existsByEmail(req.email)) {
            throw new BusinessRuleException("Email is already registered.");
        }

        User user = new User();
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setPassword(PasswordUtil.hashPassword(req.password));
        user.setName(req.name != null ? req.name : req.username);
        user.setRole(req.role != null ? req.role : "ROLE_ADMIN");

        User saved = userRepository.save(user);
        String token = generateToken(saved);

        return new AuthResponse(true, "Registration successful", token, saved.getId(), saved.getUsername(), saved.getEmail(), saved.getName(), saved.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsernameOrEmail(req.usernameOrEmail, req.usernameOrEmail)
                .orElseThrow(() -> new BusinessRuleException("Invalid credentials. Account not found."));

        if (!PasswordUtil.verifyPassword(req.password, user.getPassword())) {
            throw new BusinessRuleException("Invalid credentials. Incorrect password.");
        }

        String token = generateToken(user);
        return new AuthResponse(true, "Login successful", token, user.getId(), user.getUsername(), user.getEmail(), user.getName(), user.getRole());
    }

    public User getProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
    }

    private String generateToken(User user) {
        return "ESCROW_JWT_" + UUID.randomUUID().toString().replace("-", "") + "_" + user.getId();
    }
}
