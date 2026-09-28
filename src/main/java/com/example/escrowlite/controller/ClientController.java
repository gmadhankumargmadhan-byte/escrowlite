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