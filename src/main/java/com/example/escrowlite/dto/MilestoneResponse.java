package com.example.escrowlite.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public class MilestoneResponse {
    public Long id;
    public String title;
    public String description;
    public BigDecimal amount;
    public String status;
    public LocalDateTime deliveredAt;
    public LocalDateTime approvedAt;
    public Long projectId;
}