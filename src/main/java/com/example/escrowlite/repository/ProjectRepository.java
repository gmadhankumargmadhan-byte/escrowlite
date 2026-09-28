package com.example.escrowlite.repository;
import com.example.escrowlite.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProjectRepository extends JpaRepository<Project, Long> {}