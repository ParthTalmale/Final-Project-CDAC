# 🚀 Master Linux Deployment Guide (The Complete Edition)

This guide is split into **TWO PATHS**. You only need to choose **one**.

*   **PATH A: Manual Deployment** (Great for understanding how things work. Uses `run.sh`, etc.)
*   **PATH B: Docker Compose** (The "One-Click" automation. Skips manual setup.)

---

# 📦 PRE-REQUISITES (Do this for BOTH Paths)

Run these commands on your Linux Terminal first.

## 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

## 2. Install Docker (Highly Recommended)
```bash
sudo apt install docker.io -y
sudo apt install docker-compose-v2 -y
```

## 3. Install Java & Node (Only needed for PATH A)
*If you are choosing Path B (Compose), you can SKIP this step!*
```bash
# Java for Backend
sudo apt install openjdk-21-jdk -y

# Node & npm for Frontend
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn
```

---

# 🛣️ PATH A: Manual Deployment
*Follow this path if you want to run things yourself piece-by-piece.*

## Step 1: Database Setup

### Option 1: MySQL in Docker (Recommended)
```bash
sudo docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```
**Then Log in and Create Data:**
```bash
sudo docker exec -it mysql-container mysql -u root -p
# Pwd: root
```
```sql
CREATE DATABASE IF NOT EXISTS mediConnectDb;
CREATE USER 'medi_user'@'%' IDENTIFIED BY 'medi_password';
GRANT ALL PRIVILEGES ON mediConnectDb.* TO 'medi_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### Option 2: MySQL Native Install
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
# Then log in and create user/db manually
```

## Step 2: Backend Deployment

Navigate to: `Fixing Broken Project/spring_boot_backend_template (Our Work)`

### Option A: Run from Source (Dev Style)
**1. Create script:** `nano run.sh`
**2. Paste:**
```bash
#!/bin/bash
export DB_URL="jdbc:mysql://localhost:3306/mediConnectDb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"
export DB_USERNAME="medi_user"
export DB_PASSWORD="medi_password" 
export RAZORPAY_KEY="rzp_test_SA3qJqIkr0IH3u"
export RAZORPAY_SECRET="rhMAmdHBMZUxX1BUahx0myrG"

echo "🚀 Starting Backend from Source..."
chmod +x mvnw
./mvnw spring-boot:run
```
**3. Run:**
```bash
chmod +x run.sh
./run.sh
```

### Option B: Run as JAR (Production Style)
**1. Build:**
```bash
./mvnw clean package -DskipTests
```
**2. Create script:** `nano run_prod.sh`
**3. Paste:**
```bash
#!/bin/bash
# (Variables included for convenience)
export DB_URL="jdbc:mysql://localhost:3306/mediConnectDb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"
export DB_USERNAME="medi_user"
export DB_PASSWORD="medi_password" 
export RAZORPAY_KEY="rzp_test_SA3qJqIkr0IH3u"
export RAZORPAY_SECRET="rhMAmdHBMZUxX1BUahx0myrG"

echo "🚀 Starting JAR..."
java -jar target/spring_boot_backend_template-0.0.1.jar
```
**4. Run:**
```bash
chmod +x run_prod.sh
./run_prod.sh
```

## Step 3: Frontend Deployment

Navigate to: `Fixing Broken Project/mediconnect-frontend (Our Work)`

### Option A: Run from Source
1.  **Create .env:** `echo "VITE_API_URL=http://localhost:8080/api" > .env`
2.  **Run:** `npm install && npm run dev -- --host`

### Option B: Production Build (Dist)
1.  **Build:** `npm run build`
2.  **Serve:** `sudo npm install -g serve && serve -s dist -l 5173`

### Option C: Docker Container (Detailed)
1.  **Navigate:** `cd "Fixing Broken Project/mediconnect-frontend (Our Work)"`
2.  **Conf:** `echo "VITE_API_URL=http://localhost:8080/api" > .env`
3.  **Build:** `sudo docker build -t mediconnect-frontend .`
4.  **Run:** `sudo docker run --name frontend-app --net host -d mediconnect-frontend`

---

# 🛣️ PATH B: Docker Compose (The Automation)
*Follow this path if you want to skip all the manual steps above and just run ONE command.*

**1. Navigate to Project Root:**
```bash
cd "Fixing Broken Project"
```

**2. Run Everything:**
```bash
sudo docker compose up --build -d
```
*This command reads the `docker-compose.yml` file and automatically:*
*   starts MySQL
*   builds and starts Backend
*   builds and starts Frontend

**3. Verification:**
*   Frontend: `http://localhost:5173`
*   Backend: `http://localhost:8080`

**4. Stop it:**
```bash
sudo docker compose down
```

# ☁️ Part 6: Running on EC2 (AWS)
*Crucial Step if you deploy to the cloud!*

If you run this on a real server (AWS EC2), `localhost` won't work for the Frontend because your browser is on your laptop, not inside the server.

1.  **Edit `docker-compose.yml`:**
    ```bash
    nano docker-compose.yml
    ```
2.  **Find the Frontend Section:**
    Change:
    `VITE_API_URL: http://localhost:8080/api`
    To:
    `VITE_API_URL: http://YOUR_EC2_PUBLIC_IP:8080/api`
    *(Replace `YOUR_EC2_PUBLIC_IP` with the actual IP address of your instance)*

3.  **Restart:**
    ```bash
    sudo docker compose down
    sudo docker compose up --build -d
    ```
