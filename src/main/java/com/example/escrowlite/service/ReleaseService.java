package com.example.escrowlite.service;
import com.example.escrowlite.entity.Milestone;
import com.example.escrowlite.entity.Release;
import com.example.escrowlite.enums.MilestoneStatus;
import com.example.escrowlite.exception.BusinessRuleException;
import com.example.escrowlite.repository.MilestoneRepository;
import com.example.escrowlite.repository.ReleaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReleaseService {
    private final MilestoneRepository milestoneRepository;
    private final ReleaseRepository releaseRepository;

    public ReleaseService(MilestoneRepository milestoneRepository, ReleaseRepository releaseRepository) {
        this.milestoneRepository = milestoneRepository;
        this.releaseRepository = releaseRepository;
    }

    @Transactional
    public Map<String, Object> releasePayment(Long milestoneId) {
        Milestone m = milestoneRepository.findById(milestoneId)
            .orElseThrow(() -> new com.example.escrowlite.exception.ResourceNotFoundException("Milestone not found"));
        
        if (m.getStatus() != MilestoneStatus.APPROVED) {
            throw new BusinessRuleException("Milestone must be APPROVED before payment can be released.");
        }
        
        m.setStatus(MilestoneStatus.RELEASED);
        milestoneRepository.save(m);
        
        Release r = new Release();
        r.setAmount(m.getAmount());
        r.setReleasedAt(LocalDateTime.now());
        r.setProject(m.getProject());
        r.setMilestone(m);
        releaseRepository.save(r);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Payment released successfully.");
        response.put("releaseAmount", r.getAmount());
        response.put("milestoneId", m.getId());
        return response;
    }
}