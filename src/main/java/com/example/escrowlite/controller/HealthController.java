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