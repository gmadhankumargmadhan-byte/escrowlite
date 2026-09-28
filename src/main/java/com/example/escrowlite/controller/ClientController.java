package com.example.escrowlite.controller;

import com.example.escrowlite.dto.CreateClientRequest;
import com.example.escrowlite.entity.Client;
import com.example.escrowlite.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Client create(@Valid @RequestBody CreateClientRequest req) {
        return clientService.create(req);
    }

    @GetMapping
    public List<Client> getAll() {
        return clientService.findAll();
    }

    @GetMapping("/{id}")
    public Client getById(@PathVariable Long id) {
        return clientService.findById(id);
    }

    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @Valid @RequestBody CreateClientRequest req) {
        return clientService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        clientService.delete(id);
        return Map.of("message", "Client deleted successfully");
    }
}