package com.example.escrowlite.service;
import com.example.escrowlite.dto.MilestoneResponse;
import com.example.escrowlite.entity.Milestone;
import com.example.escrowlite.enums.MilestoneStatus;
import com.example.escrowlite.exception.BusinessRuleException;
import com.example.escrowlite.exception.ResourceNotFoundException;
import com.example.escrowlite.repository.MilestoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;

    public MilestoneService(MilestoneRepository milestoneRepository) {
        this.milestoneRepository = milestoneRepository;
    }

    public Milestone findById(Long id) {
        return milestoneRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));
    }

    public List<MilestoneResponse> findByProjectId(Long projectId) {
        return milestoneRepository.findByProjectId(projectId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }
    
    public MilestoneResponse getById(Long id) {
        return mapToResponse(findById(id));
    }

    @Transactional
    public MilestoneResponse deliver(Long id) {
        Milestone m = findById(id);
        if (m.getStatus() == MilestoneStatus.RELEASED) throw new BusinessRuleException("Cannot deliver a released milestone.");
        m.setStatus(MilestoneStatus.DELIVERED);
        m.setDeliveredAt(LocalDateTime.now());
        return mapToResponse(milestoneRepository.save(m));
    }

    @Transactional
    public MilestoneResponse approve(Long id) {
        Milestone m = findById(id);
        if (m.getStatus() != MilestoneStatus.DELIVERED) throw new BusinessRuleException("Milestone must be DELIVERED to approve.");
        m.setStatus(MilestoneStatus.APPROVED);
        m.setApprovedAt(LocalDateTime.now());
        return mapToResponse(milestoneRepository.save(m));
    }

    @Transactional
    public MilestoneResponse rework(Long id) {
        Milestone m = findById(id);
        if (m.getStatus() != MilestoneStatus.DELIVERED) throw new BusinessRuleException("Milestone must be DELIVERED to request rework.");
        m.setStatus(MilestoneStatus.REWORK_REQUESTED);
        return mapToResponse(milestoneRepository.save(m));
    }

    public MilestoneResponse mapToResponse(Milestone m) {
        MilestoneResponse res = new MilestoneResponse();
        res.id = m.getId();
        res.title = m.getTitle();
        res.description = m.getDescription();
        res.amount = m.getAmount();
        res.status = m.getStatus().name();
        res.deliveredAt = m.getDeliveredAt();
        res.approvedAt = m.getApprovedAt();
        res.projectId = m.getProject().getId();
        return res;
    }
}