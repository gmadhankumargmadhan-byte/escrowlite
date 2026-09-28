package com.example.escrowlite.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;
public class CreateProjectRequest {
    @NotBlank public String title;
    public String description;
    @NotNull @Positive public BigDecimal totalAmount;
    @NotNull public Long clientId;
    @NotNull public Long freelancerId;
    @NotEmpty public List<CreateMilestoneRequest> milestones;
}