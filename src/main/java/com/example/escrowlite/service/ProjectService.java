package com.example.escrowlite.service;

import com.example.escrowlite.dto.*;
import com.example.escrowlite.entity.*;
import com.example.escrowlite.enums.MilestoneStatus;
import com.example.escrowlite.enums.ProjectStatus;
import com.example.escrowlite.exception.BusinessRuleException;
import com.example.escrowlite.exception.ResourceNotFoundException;
import com.example.escrowlite.repository.ProjectRepository;
import com.example.escrowlite.repository.ReleaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ClientService clientService;
    private final FreelancerService freelancerService;
    private final ReleaseRepository releaseRepository;

    public ProjectService(ProjectRepository projectRepository, ClientService clientService, FreelancerService freelancerService, ReleaseRepository releaseRepository) {
        this.projectRepository = projectRepository;
        this.clientService = clientService;
        this.freelancerService = freelancerService;
        this.releaseRepository = releaseRepository;
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest req) {
        if (req.totalAmount == null || req.totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleException("Project budget cannot be negative.");
        }

        if (req.milestones != null && !req.milestones.isEmpty()) {
            BigDecimal sum = req.milestones.stream().map(m -> m.amount).reduce(BigDecimal.ZERO, BigDecimal::add);
            if (sum.compareTo(req.totalAmount) != 0) {
                throw new BusinessRuleException("Milestone amounts must equal the total project amount.");
            }
        }

        Client client = clientService.findById(req.clientId);
        Freelancer freelancer = freelancerService.findById(req.freelancerId);

        Project project = new Project();
        project.setTitle(req.title);
        project.setDescription(req.description);
        project.setTotalAmount(req.totalAmount);
        project.setStatus(ProjectStatus.CREATED);
        project.setCreatedAt(LocalDateTime.now());
        project.setClient(client);
        project.setFreelancer(freelancer);

        List<Milestone> milestones = new ArrayList<>();
        if (req.milestones != null) {
            milestones = req.milestones.stream().map(mReq -> {
                Milestone m = new Milestone();
                m.setTitle(mReq.title);
                m.setDescription(mReq.description);
                m.setAmount(mReq.amount);
                m.setStatus(MilestoneStatus.PENDING);
                m.setProject(project);
                return m;
            }).collect(Collectors.toList());
        }

        project.setMilestones(milestones);
        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    public List<ProjectResponse> findAll() {
        return projectRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ProjectResponse findById(Long id) {
        return mapToResponse(projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id)));
    }

    @Transactional
    public ProjectResponse updateProject(Long id, CreateProjectRequest req) {
        Project p = projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));
        if (req.title != null) p.setTitle(req.title);
        if (req.description != null) p.setDescription(req.description);
        if (req.totalAmount != null) p.setTotalAmount(req.totalAmount);
        if (req.clientId != null) p.setClient(clientService.findById(req.clientId));
        if (req.freelancerId != null) p.setFreelancer(freelancerService.findById(req.freelancerId));
        return mapToResponse(projectRepository.save(p));
    }

    @Transactional
    public void deleteProject(Long id) {
        Project p = projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));
        projectRepository.delete(p);
    }

    public EscrowSummaryResponse getEscrowSummary(Long id) {
        Project p = projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));
        List<Release> releases = releaseRepository.findByProjectId(id);
        BigDecimal totalReleased = releases.stream().map(Release::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        EscrowSummaryResponse res = new EscrowSummaryResponse();
        res.projectId = p.getId();
        res.totalAmount = p.getTotalAmount();
        res.totalReleased = totalReleased;
        res.remainingEscrow = p.getTotalAmount().subtract(totalReleased);
        return res;
    }

    public ProjectResponse mapToResponse(Project p) {
        ProjectResponse res = new ProjectResponse();
        res.id = p.getId();
        res.title = p.getTitle();
        res.description = p.getDescription();
        res.totalAmount = p.getTotalAmount();
        res.status = p.getStatus() != null ? p.getStatus().name() : "CREATED";
        res.createdAt = p.getCreatedAt();
        res.clientId = p.getClient() != null ? p.getClient().getId() : null;
        res.freelancerId = p.getFreelancer() != null ? p.getFreelancer().getId() : null;
        res.milestones = p.getMilestones() != null ? p.getMilestones().stream().map(m -> {
            MilestoneResponse mr = new MilestoneResponse();
            mr.id = m.getId();
            mr.title = m.getTitle();
            mr.description = m.getDescription();
            mr.amount = m.getAmount();
            mr.status = m.getStatus() != null ? m.getStatus().name() : "PENDING";
            mr.deliveredAt = m.getDeliveredAt();
            mr.approvedAt = m.getApprovedAt();
            mr.projectId = p.getId();
            return mr;
        }).collect(Collectors.toList()) : new ArrayList<>();
        return res;
    }
}