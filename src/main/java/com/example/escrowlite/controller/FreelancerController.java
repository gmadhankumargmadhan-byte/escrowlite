package com.example.escrowlite.controller;

import com.example.escrowlite.dto.CreateFreelancerRequest;
import com.example.escrowlite.entity.Freelancer;
import com.example.escrowlite.service.FreelancerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/freelancers")
public class FreelancerController {
    private final FreelancerService freelancerService;

    public FreelancerController(FreelancerService freelancerService) {
        this.freelancerService = freelancerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Freelancer create(@Valid @RequestBody CreateFreelancerRequest req) {
        return freelancerService.create(req);
    }

    @GetMapping
    public List<Freelancer> getAll() {
        return freelancerService.findAll();
    }

    @GetMapping("/{id}")
    public Freelancer getById(@PathVariable Long id) {
        return freelancerService.findById(id);
    }

    @PutMapping("/{id}")
    public Freelancer update(@PathVariable Long id, @Valid @RequestBody CreateFreelancerRequest req) {
        return freelancerService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        freelancerService.delete(id);
        return Map.of("message", "Freelancer deleted successfully");
    }
}