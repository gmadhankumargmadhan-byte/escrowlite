package com.example.escrowlite.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Username or email is required")
    public String usernameOrEmail;

    @NotBlank(message = "Password is required")
    public String password;
}
