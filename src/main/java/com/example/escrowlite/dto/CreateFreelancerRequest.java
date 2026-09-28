package com.example.escrowlite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CreateFreelancerRequest {
    @NotBlank(message = "Name is required")
    public String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    public String email;

    public String skills;
    public BigDecimal hourlyRate;
}