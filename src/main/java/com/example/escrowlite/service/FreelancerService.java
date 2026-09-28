package com.example.escrowlite.service;

import com.example.escrowlite.dto.CreateFreelancerRequest;
import com.example.escrowlite.entity.Freelancer;
import com.example.escrowlite.exception.ResourceNotFoundException;
import com.example.escrowlite.repository.FreelancerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FreelancerService {
    private final FreelancerRepository freelancerRepository;

    public FreelancerService(FreelancerRepository freelancerRepository) {
        this.freelancerRepository = freelancerRepository;
    }

    public Freelancer create(CreateFreelancerRequest req) {
        Freelancer f = new Freelancer();
        f.setName(req.name);
        f.setEmail(req.email);
        f.setSkills(req.skills);
        f.setHourlyRate(req.hourlyRate);
        return freelancerRepository.save(f);
    }

    public List<Freelancer> findAll() {
        return freelancerRepository.findAll();
    }

    public Freelancer findById(Long id) {
        return freelancerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer not found with id " + id));
    }

    public Freelancer update(Long id, CreateFreelancerRequest req) {
        Freelancer f = findById(id);
        if (req.name != null) f.setName(req.name);
        if (req.email != null) f.setEmail(req.email);
        if (req.skills != null) f.setSkills(req.skills);
        if (req.hourlyRate != null) f.setHourlyRate(req.hourlyRate);
        return freelancerRepository.save(f);
    }

    public void delete(Long id) {
        Freelancer f = findById(id);
        freelancerRepository.delete(f);
    }
}