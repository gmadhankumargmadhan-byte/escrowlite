package com.example.escrowlite.repository;
import com.example.escrowlite.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ClientRepository extends JpaRepository<Client, Long> {}