package com.example.escrowlite.controller;

import com.example.escrowlite.dto.CreateProjectRequest;
import com.example.escrowlite.dto.EscrowSummaryResponse;
import com.example.escrowlite.dto.ProjectResponse;
import com.example.escrowlite.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody CreateProjectRequest req) {
        return projectService.createProject(req);
    }

    @GetMapping
    public List<ProjectResponse> getAll() {
        return projectService.findAll();
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable Long id) {
        return projectService.findById(id);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody CreateProjectRequest req) {
        return projectService.updateProject(id, req);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return Map.of("message", "Project deleted successfully");
    }

    @GetMapping("/{id}/escrow")
    public EscrowSummaryResponse getEscrow(@PathVariable Long id) {
        return projectService.getEscrowSummary(id);
    }
}