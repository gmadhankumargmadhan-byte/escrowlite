package com.example.escrowlite.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class ProjectResponse {
    public Long id;
    public String title;
    public String description;
    public BigDecimal totalAmount;
    public String status;
    public LocalDateTime createdAt;
    public Long clientId;
    public Long freelancerId;
    public List<MilestoneResponse> milestones;
}