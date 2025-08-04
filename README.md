# Reversing Web Apps – DEF CON 2025 AppSec Village Workshop

Welcome to the **Reversing Web Apps** workshop, part of the AppSec Village at **DEF CON 33 (2025)**. This workshop environment focused on reversing engineering web applications, analyzing APIs, exploiting misconfigurations, and practicing real-world web app attack vectors.

## Workshop Overview

Participants will interact with a realistic web application stack consisting of:

- A **React** frontend
- A **PHP** backend (API)
- An **internal API** (Node.js) designed to simulate internal-only services
- A **MySQL** database seeded with data and secrets
- An **NGINX reverse proxy** to route frontend/backend traffic and isolate internal services

---

## Requirements

- Docker
- Docker Compose

---

## Getting Started

Clone the repository and launch the environment:

```bash
git clone https://github.com/Hamibubu/defcon2025appsec.git
cd defcon2025appsec
docker-compose up --build
```
---

Happy Hacking!