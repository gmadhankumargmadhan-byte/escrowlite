package com.example.escrowlite.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class CreateClientRequest {
    @NotBlank public String name;
    @NotBlank @Email public String email;
}