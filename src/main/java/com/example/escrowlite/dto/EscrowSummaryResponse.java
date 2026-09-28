package com.example.escrowlite.dto;
import java.math.BigDecimal;
public class EscrowSummaryResponse {
    public Long projectId;
    public BigDecimal totalAmount;
    public BigDecimal totalReleased;
    public BigDecimal remainingEscrow;
}