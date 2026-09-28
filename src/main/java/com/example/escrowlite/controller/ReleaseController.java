package com.example.escrowlite.controller;

import com.example.escrowlite.entity.Release;
import com.example.escrowlite.repository.ReleaseRepository;
import com.example.escrowlite.service.ReleaseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/releases")
public class ReleaseController {
    private final ReleaseRepository releaseRepository;
    private final ReleaseService releaseService;

    public ReleaseController(ReleaseRepository releaseRepository, ReleaseService releaseService) {
        this.releaseRepository = releaseRepository;
        this.releaseService = releaseService;
    }

    @GetMapping
    public List<Release> getAll() {
        return releaseRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRelease(@RequestBody Map<String, Object> body) {
        Object milestoneIdObj = body.get("milestoneId");
        if (milestoneIdObj == null) {
            throw new com.example.escrowlite.exception.BusinessRuleException("milestoneId is required");
        }
        Long milestoneId = Long.valueOf(milestoneIdObj.toString());
        return releaseService.releasePayment(milestoneId);
    }
}
