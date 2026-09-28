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