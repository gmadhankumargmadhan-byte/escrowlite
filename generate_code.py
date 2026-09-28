import os

base_pkg = "src/main/java/com/example/escrowlite"
dirs = ["entity", "dto", "repository", "service", "controller", "exception", "enums"]

for d in dirs:
    os.makedirs(os.path.join(base_pkg, d), exist_ok=True)

def write_file(path, content):
    with open(os.path.join(base_pkg, path), "w") as f:
        f.write(content.strip())

# ENUMS
write_file("enums/ProjectStatus.java", """
package com.example.escrowlite.enums;
public enum ProjectStatus { CREATED, IN_PROGRESS, COMPLETED, CANCELLED }
""")

write_file("enums/MilestoneStatus.java", """
package com.example.escrowlite.enums;
public enum MilestoneStatus { PENDING, DELIVERED, REWORK_REQUESTED, APPROVED, RELEASED }
""")

# ENTITIES
write_file("entity/Client.java", """
package com.example.escrowlite.entity;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Project> projects;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }
}
""")

write_file("entity/Freelancer.java", """
package com.example.escrowlite.entity;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Freelancer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL)
    private List<Project> projects;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }
}
""")

write_file("entity/Project.java", """
package com.example.escrowlite.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.example.escrowlite.enums.ProjectStatus;

@Entity
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "freelancer_id")
    private Freelancer freelancer;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Milestone> milestones;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Release> releases;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public Freelancer getFreelancer() { return freelancer; }
    public void setFreelancer(Freelancer freelancer) { this.freelancer = freelancer; }
    public List<Milestone> getMilestones() { return milestones; }
    public void setMilestones(List<Milestone> milestones) { this.milestones = milestones; }
    public List<Release> getReleases() { return releases; }
    public void setReleases(List<Release> releases) { this.releases = releases; }
}
""")

write_file("entity/Milestone.java", """
package com.example.escrowlite.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.example.escrowlite.enums.MilestoneStatus;

@Entity
public class Milestone {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private MilestoneStatus status;
    
    private LocalDateTime deliveredAt;
    private LocalDateTime approvedAt;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public MilestoneStatus getStatus() { return status; }
    public void setStatus(MilestoneStatus status) { this.status = status; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}
""")

write_file("entity/Release.java", """
package com.example.escrowlite.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_release")
public class Release {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal amount;
    private LocalDateTime releasedAt;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "milestone_id")
    private Milestone milestone;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDateTime getReleasedAt() { return releasedAt; }
    public void setReleasedAt(LocalDateTime releasedAt) { this.releasedAt = releasedAt; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public Milestone getMilestone() { return milestone; }
    public void setMilestone(Milestone milestone) { this.milestone = milestone; }
}
""")

# DTOs
write_file("dto/CreateClientRequest.java", """
package com.example.escrowlite.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class CreateClientRequest {
    @NotBlank public String name;
    @NotBlank @Email public String email;
}
""")

write_file("dto/CreateFreelancerRequest.java", """
package com.example.escrowlite.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class CreateFreelancerRequest {
    @NotBlank public String name;
    @NotBlank @Email public String email;
}
""")

write_file("dto/CreateMilestoneRequest.java", """
package com.example.escrowlite.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
public class CreateMilestoneRequest {
    @NotBlank public String title;
    public String description;
    @NotNull @Positive public BigDecimal amount;
}
""")

write_file("dto/CreateProjectRequest.java", """
package com.example.escrowlite.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;
public class CreateProjectRequest {
    @NotBlank public String title;
    public String description;
    @NotNull @Positive public BigDecimal totalAmount;
    @NotNull public Long clientId;
    @NotNull public Long freelancerId;
    @NotEmpty public List<CreateMilestoneRequest> milestones;
}
""")

write_file("dto/ProjectResponse.java", """
package com.example.escrowlite.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public class ProjectResponse {
    public Long id;
    public String title;
    public String description;
    public BigDecimal totalAmount;
    public String status;
    public LocalDateTime createdAt;
    public Long clientId;
    public Long freelancerId;
    public List<MilestoneResponse> milestones;
}
""")

write_file("dto/MilestoneResponse.java", """
package com.example.escrowlite.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public class MilestoneResponse {
    public Long id;
    public String title;
    public String description;
    public BigDecimal amount;
    public String status;
    public LocalDateTime deliveredAt;
    public LocalDateTime approvedAt;
    public Long projectId;
}
""")

write_file("dto/EscrowSummaryResponse.java", """
package com.example.escrowlite.dto;
import java.math.BigDecimal;
public class EscrowSummaryResponse {
    public Long projectId;
    public BigDecimal totalAmount;
    public BigDecimal totalReleased;
    public BigDecimal remainingEscrow;
}
""")

write_file("dto/ErrorResponse.java", """
package com.example.escrowlite.dto;
public class ErrorResponse {
    public String timestamp;
    public int status;
    public String error;
    public String message;
}
""")

# Exceptions
write_file("exception/ResourceNotFoundException.java", """
package com.example.escrowlite.exception;
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
}
""")

write_file("exception/BusinessRuleException.java", """
package com.example.escrowlite.exception;
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) { super(message); }
}
""")

write_file("exception/GlobalExceptionHandler.java", """
package com.example.escrowlite.exception;
import com.example.escrowlite.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse err = new ErrorResponse();
        err.timestamp = LocalDateTime.now().toString();
        err.status = HttpStatus.NOT_FOUND.value();
        err.error = "Not Found";
        err.message = ex.getMessage();
        return err;
    }

    @ExceptionHandler(BusinessRuleException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBusinessRule(BusinessRuleException ex) {
        ErrorResponse err = new ErrorResponse();
        err.timestamp = LocalDateTime.now().toString();
        err.status = HttpStatus.BAD_REQUEST.value();
        err.error = "Business Rule Violation";
        err.message = ex.getMessage();
        return err;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        ErrorResponse err = new ErrorResponse();
        err.timestamp = LocalDateTime.now().toString();
        err.status = HttpStatus.BAD_REQUEST.value();
        err.error = "Validation Error";
        err.message = ex.getBindingResult().getFieldError().getDefaultMessage();
        return err;
    }
}
""")

# Repositories
write_file("repository/ClientRepository.java", """
package com.example.escrowlite.repository;
import com.example.escrowlite.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ClientRepository extends JpaRepository<Client, Long> {}
""")

write_file("repository/FreelancerRepository.java", """
package com.example.escrowlite.repository;
import com.example.escrowlite.entity.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {}
""")

write_file("repository/ProjectRepository.java", """
package com.example.escrowlite.repository;
import com.example.escrowlite.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProjectRepository extends JpaRepository<Project, Long> {}
""")

write_file("repository/MilestoneRepository.java", """
package com.example.escrowlite.repository;
import com.example.escrowlite.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByProjectId(Long projectId);
}
""")

write_file("repository/ReleaseRepository.java", """
package com.example.escrowlite.repository;
import com.example.escrowlite.entity.Release;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ReleaseRepository extends JpaRepository<Release, Long> {
    List<Release> findByProjectId(Long projectId);
}
""")

# Services
write_file("service/ClientService.java", """
package com.example.escrowlite.service;
import com.example.escrowlite.dto.CreateClientRequest;
import com.example.escrowlite.entity.Client;
import com.example.escrowlite.exception.ResourceNotFoundException;
import com.example.escrowlite.repository.ClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientService {
    private final ClientRepository clientRepository;
    public ClientService(ClientRepository clientRepository) { this.clientRepository = clientRepository; }
    
    public Client create(CreateClientRequest req) {
        Client client = new Client();
        client.setName(req.name);
        client.setEmail(req.email);
        return clientRepository.save(client);
    }
    public List<Client> findAll() { return clientRepository.findAll(); }
    public Client findById(Long id) { return clientRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Client not found")); }
}
""")

write_file("service/FreelancerService.java", """
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
    public FreelancerService(FreelancerRepository freelancerRepository) { this.freelancerRepository = freelancerRepository; }
    
    public Freelancer create(CreateFreelancerRequest req) {
        Freelancer f = new Freelancer();
        f.setName(req.name);
        f.setEmail(req.email);
        return freelancerRepository.save(f);
    }
    public List<Freelancer> findAll() { return freelancerRepository.findAll(); }
    public Freelancer findById(Long id) { return freelancerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Freelancer not found")); }
}
""")

write_file("service/ProjectService.java", """
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
        BigDecimal sum = req.milestones.stream().map(m -> m.amount).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (sum.compareTo(req.totalAmount) != 0) {
            throw new BusinessRuleException("Milestone amounts must equal the total project amount.");
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

        List<Milestone> milestones = req.milestones.stream().map(mReq -> {
            Milestone m = new Milestone();
            m.setTitle(mReq.title);
            m.setDescription(mReq.description);
            m.setAmount(mReq.amount);
            m.setStatus(MilestoneStatus.PENDING);
            m.setProject(project);
            return m;
        }).collect(Collectors.toList());

        project.setMilestones(milestones);
        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    public List<ProjectResponse> findAll() {
        return projectRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ProjectResponse findById(Long id) {
        return mapToResponse(projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found")));
    }

    public EscrowSummaryResponse getEscrowSummary(Long id) {
        Project p = projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
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
        res.status = p.getStatus().name();
        res.createdAt = p.getCreatedAt();
        res.clientId = p.getClient().getId();
        res.freelancerId = p.getFreelancer().getId();
        res.milestones = p.getMilestones().stream().map(m -> {
            MilestoneResponse mr = new MilestoneResponse();
            mr.id = m.getId();
            mr.title = m.getTitle();
            mr.description = m.getDescription();
            mr.amount = m.getAmount();
            mr.status = m.getStatus().name();
            mr.deliveredAt = m.getDeliveredAt();
            mr.approvedAt = m.getApprovedAt();
            mr.projectId = p.getId();
            return mr;
        }).collect(Collectors.toList());
        return res;
    }
}
""")

write_file("service/MilestoneService.java", """
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
""")

write_file("service/ReleaseService.java", """
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
""")

# Controllers
write_file("controller/HealthController.java", """
package com.example.escrowlite.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    @GetMapping
    public Map<String, String> health() {
        Map<String, String> r = new HashMap<>();
        r.put("status", "UP");
        r.put("application", "EscrowLite");
        return r;
    }
}
""")

write_file("controller/ClientController.java", """
package com.example.escrowlite.controller;
import com.example.escrowlite.dto.CreateClientRequest;
import com.example.escrowlite.entity.Client;
import com.example.escrowlite.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;
    public ClientController(ClientService clientService) { this.clientService = clientService; }

    @PostMapping
    public Client create(@Valid @RequestBody CreateClientRequest req) { return clientService.create(req); }

    @GetMapping
    public List<Client> getAll() { return clientService.findAll(); }

    @GetMapping("/{id}")
    public Client getById(@PathVariable Long id) { return clientService.findById(id); }
}
""")

write_file("controller/FreelancerController.java", """
package com.example.escrowlite.controller;
import com.example.escrowlite.dto.CreateFreelancerRequest;
import com.example.escrowlite.entity.Freelancer;
import com.example.escrowlite.service.FreelancerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/freelancers")
public class FreelancerController {
    private final FreelancerService freelancerService;
    public FreelancerController(FreelancerService freelancerService) { this.freelancerService = freelancerService; }

    @PostMapping
    public Freelancer create(@Valid @RequestBody CreateFreelancerRequest req) { return freelancerService.create(req); }

    @GetMapping
    public List<Freelancer> getAll() { return freelancerService.findAll(); }

    @GetMapping("/{id}")
    public Freelancer getById(@PathVariable Long id) { return freelancerService.findById(id); }
}
""")

write_file("controller/ProjectController.java", """
package com.example.escrowlite.controller;
import com.example.escrowlite.dto.CreateProjectRequest;
import com.example.escrowlite.dto.EscrowSummaryResponse;
import com.example.escrowlite.dto.ProjectResponse;
import com.example.escrowlite.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    public ProjectController(ProjectService projectService) { this.projectService = projectService; }

    @PostMapping
    public ProjectResponse create(@Valid @RequestBody CreateProjectRequest req) { return projectService.createProject(req); }

    @GetMapping
    public List<ProjectResponse> getAll() { return projectService.findAll(); }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable Long id) { return projectService.findById(id); }
    
    @GetMapping("/{id}/escrow")
    public EscrowSummaryResponse getEscrow(@PathVariable Long id) { return projectService.getEscrowSummary(id); }
}
""")

write_file("controller/MilestoneController.java", """
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
""")
