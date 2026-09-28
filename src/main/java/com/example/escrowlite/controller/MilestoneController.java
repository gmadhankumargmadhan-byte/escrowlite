package com.example.escrowlite.controller;

import com.example.escrowlite.dto.CreateMilestoneRequest;
import com.example.escrowlite.dto.MilestoneResponse;
import com.example.escrowlite.service.MilestoneService;
import com.example.escrowlite.service.ReleaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MilestoneController {
    private final MilestoneService milestoneService;
    private final ReleaseService releaseService;

    public MilestoneController(MilestoneService milestoneService, ReleaseService releaseService) {
        this.milestoneService = milestoneService;
        this.releaseService = releaseService;
    }

    @GetMapping("/milestones")
    public List<MilestoneResponse> getAll() {
        return milestoneService.findAll();
    }

    @GetMapping("/projects/{projectId}/milestones")
    public List<MilestoneResponse> getByProject(@PathVariable Long projectId) {
        return milestoneService.findByProjectId(projectId);
    }

    @PostMapping("/projects/{projectId}/milestones")
    @ResponseStatus(HttpStatus.CREATED)
    public MilestoneResponse createForProject(@PathVariable Long projectId, @Valid @RequestBody CreateMilestoneRequest req) {
        return milestoneService.create(req, projectId);
    }

    @PostMapping("/milestones")
    @ResponseStatus(HttpStatus.CREATED)
    public MilestoneResponse create(@Valid @RequestBody CreateMilestoneRequest req) {
        if (req.projectId == null) {
            throw new com.example.escrowlite.exception.BusinessRuleException("projectId is required when creating a milestone.");
        }
        return milestoneService.create(req, req.projectId);
    }

    @GetMapping("/milestones/{id}")
    public MilestoneResponse getById(@PathVariable Long id) {
        return milestoneService.getById(id);
    }

    @PutMapping("/milestones/{id}")
    public MilestoneResponse update(@PathVariable Long id, @Valid @RequestBody CreateMilestoneRequest req) {
        return milestoneService.update(id, req);
    }

    @DeleteMapping("/milestones/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        milestoneService.delete(id);
        return Map.of("message", "Milestone deleted successfully");
    }

    @PutMapping("/milestones/{id}/deliver")
    public MilestoneResponse deliver(@PathVariable Long id) {
        return milestoneService.deliver(id);
    }

    @PutMapping("/milestones/{id}/approve")
    public MilestoneResponse approve(@PathVariable Long id) {
        return milestoneService.approve(id);
    }

    @PutMapping("/milestones/{id}/rework")
    public MilestoneResponse rework(@PathVariable Long id) {
        return milestoneService.rework(id);
    }

    @PostMapping("/milestones/{id}/release")
    public Map<String, Object> release(@PathVariable Long id) {
        return releaseService.releasePayment(id);
    }
}