package com.example.escrowlite.service;

import com.example.escrowlite.dto.AuthResponse;
import com.example.escrowlite.dto.LoginRequest;
import com.example.escrowlite.dto.RegisterRequest;
import com.example.escrowlite.entity.Client;
import com.example.escrowlite.entity.Freelancer;
import com.example.escrowlite.entity.User;
import com.example.escrowlite.exception.BusinessRuleException;
import com.example.escrowlite.exception.ResourceNotFoundException;
import com.example.escrowlite.repository.ClientRepository;
import com.example.escrowlite.repository.FreelancerRepository;
import com.example.escrowlite.repository.UserRepository;
import com.example.escrowlite.util.PasswordUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final FreelancerRepository freelancerRepository;

    public AuthService(UserRepository userRepository, ClientRepository clientRepository, FreelancerRepository freelancerRepository) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.freelancerRepository = freelancerRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String username = (req.username != null && !req.username.trim().isEmpty()) 
                ? req.username.trim() 
                : req.email.trim();

        if (userRepository.existsByUsername(username)) {
            throw new BusinessRuleException("Username or account is already taken.");
        }
        if (userRepository.existsByEmail(req.email.trim())) {
            throw new BusinessRuleException("Email is already registered. Please sign in instead.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(req.email.trim());
        user.setPassword(PasswordUtil.hashPassword(req.password));
        user.setName(req.name != null && !req.name.trim().isEmpty() ? req.name.trim() : username);
        
        String role = req.role != null ? req.role : "ROLE_CLIENT";
        user.setRole(role);

        User saved = userRepository.save(user);

        // Auto-create Client or Freelancer entity record based on role
        if ("ROLE_CLIENT".equalsIgnoreCase(role) || "CLIENT".equalsIgnoreCase(role)) {
            Client client = new Client();
            client.setName(saved.getName());
            client.setEmail(saved.getEmail());
            clientRepository.save(client);
        } else if ("ROLE_FREELANCER".equalsIgnoreCase(role) || "FREELANCER".equalsIgnoreCase(role)) {
            Freelancer freelancer = new Freelancer();
            freelancer.setName(saved.getName());
            freelancer.setEmail(saved.getEmail());
            freelancerRepository.save(freelancer);
        }

        String token = generateToken(saved);

        return new AuthResponse(true, "Registration successful", token, saved.getId(), saved.getUsername(), saved.getEmail(), saved.getName(), saved.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsernameOrEmail(req.usernameOrEmail.trim(), req.usernameOrEmail.trim())
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
