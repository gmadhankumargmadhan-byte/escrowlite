package com.example.escrowlite.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class CreateMilestoneRequest {
    public Long projectId;

    @NotBlank(message = "Title is required")
    public String title;

    public String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    public BigDecimal amount;
}