package com.example.escrowlite.config;

import com.example.escrowlite.entity.User;
import com.example.escrowlite.repository.UserRepository;
import com.example.escrowlite.util.PasswordUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        try {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@escrowlite.com");
                admin.setPassword(PasswordUtil.hashPassword("admin123"));
                admin.setName("EscrowLite Admin");
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);

                User demoClient = new User();
                demoClient.setUsername("client_demo");
                demoClient.setEmail("client@acme.com");
                demoClient.setPassword(PasswordUtil.hashPassword("client123"));
                demoClient.setName("Acme Global Client");
                demoClient.setRole("ROLE_CLIENT");
                userRepository.save(demoClient);
            }
        } catch (Exception e) {
            // Ignore during initial schema creation in tests
        }
    }
}
