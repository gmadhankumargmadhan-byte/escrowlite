package com.example.escrowlite.service;

import com.example.escrowlite.dto.CreateMilestoneRequest;
import com.example.escrowlite.dto.MilestoneResponse;
import com.example.escrowlite.entity.Milestone;
import com.example.escrowlite.entity.Project;
import com.example.escrowlite.enums.MilestoneStatus;
import com.example.escrowlite.exception.BusinessRuleException;
import com.example.escrowlite.exception.ResourceNotFoundException;
import com.example.escrowlite.repository.MilestoneRepository;
import com.example.escrowlite.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;

    public MilestoneService(MilestoneRepository milestoneRepository, ProjectRepository projectRepository) {
        this.milestoneRepository = milestoneRepository;
        this.projectRepository = projectRepository;
    }

    public Milestone findById(Long id) {
        return milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with id " + id));
    }

    public List<MilestoneResponse> findAll() {
        return milestoneRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<MilestoneResponse> findByProjectId(Long projectId) {
        return milestoneRepository.findByProjectId(projectId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public MilestoneResponse getById(Long id) {
        return mapToResponse(findById(id));
    }

    @Transactional
    public MilestoneResponse create(CreateMilestoneRequest req, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + projectId));

        Milestone m = new Milestone();
        m.setTitle(req.title);
        m.setDescription(req.description);
        m.setAmount(req.amount);
        m.setStatus(MilestoneStatus.PENDING);
        m.setProject(project);

        Milestone saved = milestoneRepository.save(m);
        return mapToResponse(saved);
    }

    @Transactional
    public MilestoneResponse update(Long id, CreateMilestoneRequest req) {
        Milestone m = findById(id);
        if (req.title != null) m.setTitle(req.title);
        if (req.description != null) m.setDescription(req.description);
        if (req.amount != null) m.setAmount(req.amount);
        return mapToResponse(milestoneRepository.save(m));
    }

    @Transactional
    public void delete(Long id) {
        Milestone m = findById(id);
        milestoneRepository.delete(m);
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
        res.status = m.getStatus() != null ? m.getStatus().name() : "PENDING";
        res.deliveredAt = m.getDeliveredAt();
        res.approvedAt = m.getApprovedAt();
        res.projectId = m.getProject() != null ? m.getProject().getId() : null;
        return res;
    }
}