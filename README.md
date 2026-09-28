# EscrowLite - Freelance Escrow Management System

Simple, transparent milestone-based freelance payment release tracker and escrow management platform built with **Spring Boot 4**, **Java 27**, **MySQL**, and **React (Vite)**.

---

## 🚀 Features

- **Client Management**: Create, update, view, and delete client accounts.
- **Freelancer Management**: Manage freelancer profiles with skills and hourly rates.
- **Project Tracking**: Create milestone-funded projects assigned to specific clients and freelancers.
- **Milestone Workflow**: Deliver, review, request rework, and approve project milestones.
- **Escrow & Payment Release**: Simulated escrow holding and automatic release of funds upon client approval.
- **System Health Monitor**: Live backend health status check at `/api/health`.
- **Dashboard UI**: Modern financial dashboard built with React & Vite.

---

## 🛠️ Technology Stack

- **Backend**: Java 27, Spring Boot 4.1.1, Spring Data JPA, Hibernate 7
- **Database**: MySQL 8.0 (Database name: `escrowlite_db`)
- **Frontend**: React, Vite, Axios, Lucide Icons
- **Testing**: JUnit 5, Spring Boot Test, H2 In-Memory Database (Isolated tests)
- **API Documentation**: Postman Collection (`EscrowLite_Postman_Collection.json`)

---

## 📊 Database Configuration & Setup

1. Start your local MySQL Server on port `3306`.
2. Create the target database (if not automatically created):
```sql
CREATE DATABASE IF NOT EXISTS escrowlite_db;
```
3. Set your environment variables (or rely on default `root`/`root`):
```powershell
$env:MYSQL_USER = "root"
$env:MYSQL_PASSWORD = "your_mysql_password"
```

---

## 🏃 Running the Backend (Spring Boot)

Run the following PowerShell commands from the project root:

```powershell
# 1. Clean build
.\mvnw.cmd clean

# 2. Run automated tests
.\mvnw.cmd test

# 3. Package JAR artifact
.\mvnw.cmd package

# 4. Boot Spring Boot Application
.\mvnw.cmd spring-boot:run
```

The Spring Boot backend will start on **http://localhost:8080**.

---

## 💻 Running the Frontend (React + Vite)

From the project root:

```powershell
cd frontend

# Install dependencies
npm install

# Build for production (verification)
npm run build

# Start local development server
npm run dev
```

The React frontend will be accessible at **http://localhost:5173**.

---

## 📡 REST API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health status check |
| `GET / POST` | `/api/clients` | List all clients / Create client |
| `GET / PUT / DELETE` | `/api/clients/{id}` | Client detail / Update / Delete |
| `GET / POST` | `/api/freelancers` | List all freelancers / Create freelancer |
| `GET / PUT / DELETE` | `/api/freelancers/{id}` | Freelancer detail / Update / Delete |
| `GET / POST` | `/api/projects` | List all projects / Create project |
| `GET / PUT / DELETE` | `/api/projects/{id}` | Project detail / Update / Delete |
| `GET` | `/api/projects/{id}/escrow` | Get project escrow summary |
| `GET / POST` | `/api/milestones` | List / Create milestones |
| `PUT` | `/api/milestones/{id}/deliver` | Freelancer delivers milestone |
| `PUT` | `/api/milestones/{id}/approve` | Client approves milestone |
| `PUT` | `/api/milestones/{id}/rework` | Client requests milestone rework |
| `POST` | `/api/milestones/{id}/release` | Release milestone funds from escrow |
| `GET / POST` | `/api/releases` | List all releases / Release payment |

---

## 🧪 Postman API Testing

Import `EscrowLite_Postman_Collection.json` directly into Postman to test all endpoints.

---

## ❓ Troubleshooting

- **Port 8080 in use**: Check occupied port using `netstat -ano | findstr :8080` and terminate the old process.
- **MySQL Access Denied**: Verify your `MYSQL_PASSWORD` environment variable matches your local MySQL root password.
- **CORS Errors**: CORS is configured in `CorsConfig.java` to explicitly allow `http://localhost:5173`.