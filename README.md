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