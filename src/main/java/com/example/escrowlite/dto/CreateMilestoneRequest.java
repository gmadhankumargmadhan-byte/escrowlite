package com.example.escrowlite.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
public class CreateMilestoneRequest {
    @NotBlank public String title;
    public String description;
    @NotNull @Positive public BigDecimal amount;
}