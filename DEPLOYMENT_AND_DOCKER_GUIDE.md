# 🐳 Ultimate Docker Deployment & Interview Guide

> **Goal**: Deploy your Full-Stack Application (React + Spring Boot + MySQL) using Docker, ensuring credentials are safe.

This command center guide assumes you are starting from your project root:
`E:/Sunbeam DAC Assignments/Final Project/Fixing Broken Project/`

---

## 🛑 Phase 1: Security First (The ".env" File)
*Interview Question: "How do you manage sensitive credentials like Database passwords or Payment Keys in Docker?"*

**Answer**: "I never hardcode secrets in `Dockerfile` or `application.properties`. I use **Environment Variables** injected at runtime. In development, I use a `.env` file that is excluded from Git (`.gitignore`)."

### Step 1: Create the Secret File
Create a new file named `.env` in the root folder (same place as `docker-compose.yml`) and add this content:

```ini
# Database Secrets
MYSQL_ROOT_PASSWORD=my_secure_root_password
MYSQL_DATABASE=mediconnect_db

# Razorpay Secrets (From your Dashboard)
RAZORPAY_KEY_ID=rzp_test_123456789
RAZORPAY_KEY_SECRET=abcdef123456

# JWT Secret (Make this long and random!)
JWT_SECRET=super_secret_key_for_signing_jwt_tokens_12345
```

---

## 🛠️ Phase 2: Configure Docker Compose
*Interview Question: "What is Docker Compose used for?"*

**Answer**: "Docker Compose is an **Orchestrator** for local development. It allows me to define my **Microservices Architecture** (Frontend, Backend, DB) as a single Infrastructure-as-Code file. It handles **Networking** (services can talk to each other by name) and **Volumes** (data persistence)."

### Step 2: Update `docker-compose.yml`
Update your `docker-compose.yml` to use the variables from `.env`.

**Change the `environment` sections to look like this:**

```yaml
  mysql_db:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
  
  backend:
    environment:
      # We reference the service name "mysql_db" as the hostname!
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql_db:3306/${MYSQL_DATABASE}?useSSL=false
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      # Inject Razorpay keys into the container
      RAZORPAY_KEY_ID: ${RAZORPAY_KEY_ID}
      RAZORPAY_KEY_SECRET: ${RAZORPAY_KEY_SECRET}
```

---

## 🚀 Phase 3: Launching the Rocket (Running Docker)
*Interview Question: "Walk me through the deployment command."*

### Step 3: The Command
Open your terminal in the root folder and run:

```bash
docker-compose up --build
```

### 🧠 Explanation of the Command:
1.  **`docker-compose`**: Tells Docker to look for `docker-compose.yml`.
2.  **`up`**: The command to start everything.
    *   It pulls the `mysql` image from Docker Hub.
    *   It creates a **Virtual Network** where `frontend`, `backend`, and `mysql_db` can talk to each other.
3.  **`--build`**: Crucial! It forces Docker to **re-compile** your Java JAR and **re-build** your React `dist/` folder using the instructions in your `Dockerfile`s. If you change code, always run with `--build`.

---

## ✅ Phase 4: Verification
Once the logs stop scrolling and errors are gone:

1.  **Frontend**: Open [http://localhost:80](http://localhost:80) (Standard Web Port).
    *   *Note*: The frontend access port is defined in `docker-compose.yml` under `frontend > ports: "80:80"`.
2.  **Backend API**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).
    *   *Note*: Even though Frontend talks to Backend internally, we exposed port 8080 so you can still test APIs directly.

---

## 🎓 Phase 5: The "Interview Gold" (Why did we do this?)

### 1. The Multi-Stage Build (Frontend)
*   **Concept**: In `mediconnect-frontend/Dockerfile`, we have two `FROM` commands.
*   **Why?**:
    *   **Stage 1 (Node)**: Has typical heavy tools (npm, webpack) to compile React code. The result is a small `dist` folder.
    *   **Stage 2 (Nginx)**: We verify copy *only* the `dist` folder to a lightweight Nginx server.
    *   **Result**: The final image is ~20MB instead of ~500MB. This is **Optimization**.

### 2. Reverse Proxy (Nginx)
*   **Concept**: We added `nginx.conf`.
*   **Why?**: React is a Single Page App (SPA). If you refresh `/dashboard`, a standard server yields "404 Not Found" (because that file doesn't exist).
    *   **The Fix**: `try_files $uri /index.html`. We force Nginx to serve `index.html` for every route, letting React Router handle the logic.
    *   **Bonus**: Nginx passes `/api/` requests to the Backend Container, solving **CORS** issues in production!

### 3. Data Persistence (Volumes)
*   **Concept**: `volumes: - mysql_data:/var/lib/mysql`.
*   **Why?**: Containers are "ephemeral" (temporary). If you delete the `mysql_db` container, all patient data dies with it.
    *   **The Fix**: We map the internal MySQL folder to a managed **Docker Volume**. Even if you destroy the container, the Volume survives. Next time you run `up`, your data is still there.

---

## 🏃 Next Steps
1.  **Test the Flow**: Register a patient, book an appointment, pay via Razorpay.
2.  **Push to GitHub**:
    *   **CRITICAL**: Make sure `.env` is in your `.gitignore` file before pushing!
    *   Push everything else.
3.  **Deploy to Cloud**:
    *   Copy your project to an EC2 instance.
    *   Add your `.env` file there manually.
    *   Run `docker-compose up -d` (Detached mode, runs in background).
    *   You are live! 🌍
