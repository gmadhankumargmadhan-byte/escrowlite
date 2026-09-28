import os

def write_file(path, content):
    with open(path, "w") as f:
        f.write(content.strip())

write_file("src/main/resources/application.properties", """
spring.application.name=escrowlite
spring.datasource.url=jdbc:mysql://localhost:3306/escrowlite_db?createDatabaseIfNotExist=true
spring.datasource.username=${MYSQL_USER:root}
spring.datasource.password=${MYSQL_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
""")

write_file("src/test/java/com/example/escrowlite/EscrowliteApplicationTests.java", """
package com.example.escrowlite;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class EscrowliteApplicationTests {
    @Test
    void contextLoads() {}
}
""")

write_file("README.md", """
# EscrowLite - Milestone-Based Freelance Payment Release Tracker

## Problem Statement
Student freelancers and small clients working on project gigs can have disputes over payment timing because money changes hands only at project completion. 

## Objective
EscrowLite provides milestone-based payment accountability. The agreed project amount is notionally held in escrow and payment is released only when the corresponding milestone is approved by the client.

## Technologies
- Java 17
- Spring Boot 3.2.x
- Spring Data JPA, Hibernate
- MySQL
- Jakarta Bean Validation
- JUnit / Spring Boot Test

## Configuration
Configure `src/main/resources/application.properties` with your MySQL credentials before running:
```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

## How to Run
```bash
./mvnw clean package
./mvnw spring-boot:run
```
""")
