# 🐳 Docker Containerization Runbook (Step-by-Step)

This is your pure execution guide. Follow these steps sequentially to build, run, and verify your application using Docker.

---

## 🛠️ Step 0: Prerequisites Check

**Action**: Open a terminal (PowerShell or CMD) and run:
```bash
docker --version
docker-compose --version
```
**Expected Output**: You should see version numbers (e.g., `Docker version 20.10.x`).
**If Fails**: Install Docker Desktop for Windows and ensure it is running.

---

## 🏗️ Step 1: Create the Secret Configuration

**Action**:
1.  Navigate to your project root folder: `E:\Sunbeam DAC Assignments\Final Project\Fixing Broken Project\`
2.  Create a file named `.env`.
3.  Paste the following (Replace values with your real keys):
    ```ini
    MYSQL_ROOT_PASSWORD=root
    MYSQL_DATABASE=mediconnect_db
    RAZORPAY_KEY_ID=YOUR_REAL_ID_HERE
    RAZORPAY_KEY_SECRET=YOUR_REAL_SECRET_HERE
    ```

**Test**: Run `type .env` (Windows) or `cat .env` (Mac/Linux).
**Expected Output**: It should display your keys on the screen.

---

## ☕ Step 2: Test the Backend Container Standalone

**Action**:
1.  Navigate to the backend folder:
    ```bash
    cd "spring_boot_backend_template (Our Work)"
    ```
2.  Build the backend image:
    ```bash
    docker build -t mediconnect-backend .
    ```
    *(Note: This might take 2-3 minutes the first time as it downloads Maven dependencies).*

**Test**: Run the container temporarily (it will fail to connect to DB, but we verify it starts):
```bash
docker run --rm mediconnect-backend
```
**Expected Output**: You should see Spring Boot logs starting up like ` .   ____          _            __ _ _`.
It will likely crash with `Connection refused` (because MySQL isn't running), but **that proves the Java build worked!**

---

## ⚛️ Step 3: Test the Frontend Container Standalone

**Action**:
1.  Navigate to the frontend folder:
    ```bash
    cd "../mediconnect-frontend (Our Work)"
    ```
2.  Build the frontend image:
    ```bash
    docker build -t mediconnect-frontend .
    ```

**Test**: Run the web server:
```bash
docker run --rm -p 3000:80 mediconnect-frontend
```
**Verification**: Open Browser -> `http://localhost:3000`
**Expected Output**: You should see the Login Page. (Authentication won't work yet, but the UI is running!).
*Stop the container with `Ctrl + C`.*

---

## 🚀 Step 4: The Grand Assembly (Docker Compose)

Now we connect everything (DB + Backend + Frontend).

**Action**:
1.  Go back to the root folder:
    ```bash
    cd ..
    ```
2.  Start the entire stack:
    ```bash
    docker-compose up --build
    ```

**Test 1 (Database)**: Wait until you see `[System] [MY-010931] ... ready for connections.` in the logs.
**Test 2 (Backend)**: Wait for `Started MediConnectApplication in ... seconds`.
**Test 3 (Frontend)**: Open your browser to `http://localhost:80`.

---

## 🕵️ Step 5: Final Functional Verification

Perform this checklist in the browser (`http://localhost:80`):

1.  **Register**: Create a new Patient account.
    *   *Success*: You are redirected to Login.
2.  **Login**: Log in with the new account.
    *   *Success*: You see the Patient Dashboard.
3.  **Check API**: Open a new tab -> `http://localhost:8080/api/auth/login`.
    *   *Success*: You should get a `405 Method Not Allowed` or similar (proving the API is reachable).

---

## 🧹 Step 6: Shutdown

**Action**:
In the terminal where Docker is running, press `Ctrl + C`.
To remove the containers (clean slate), run:
```bash
docker-compose down
```
**Done!** You have successfully containerized and verified the application.
