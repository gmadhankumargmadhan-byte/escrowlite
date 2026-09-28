package com.example.escrowlite.controller;
import com.example.escrowlite.dto.MilestoneResponse;
import com.example.escrowlite.service.MilestoneService;
import com.example.escrowlite.service.ReleaseService;
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

    @GetMapping("/projects/{projectId}/milestones")
    public List<MilestoneResponse> getByProject(@PathVariable Long projectId) { return milestoneService.findByProjectId(projectId); }

    @GetMapping("/milestones/{id}")
    public MilestoneResponse getById(@PathVariable Long id) { return milestoneService.getById(id); }

    @PutMapping("/milestones/{id}/deliver")
    public MilestoneResponse deliver(@PathVariable Long id) { return milestoneService.deliver(id); }

    @PutMapping("/milestones/{id}/approve")
    public MilestoneResponse approve(@PathVariable Long id) { return milestoneService.approve(id); }

    @PutMapping("/milestones/{id}/rework")
    public MilestoneResponse rework(@PathVariable Long id) { return milestoneService.rework(id); }

    @PostMapping("/milestones/{id}/release")
    public Map<String, Object> release(@PathVariable Long id) { return releaseService.releasePayment(id); }
}