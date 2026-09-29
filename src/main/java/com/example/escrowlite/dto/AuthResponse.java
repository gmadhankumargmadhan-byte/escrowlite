package com.example.escrowlite.dto;

public class AuthResponse {
    public boolean success;
    public String message;
    public String token;
    public Long userId;
    public String username;
    public String email;
    public String name;
    public String role;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message, String token, Long userId, String username, String email, String name, String role) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}
