# 🚀 Master Linux Deployment Guide

This is the **complete guide**. It contains every step you need, from installing software to running the project.

---

## Part 1: Install Software (Prerequisites)

Run these commands on your Linux Terminal to get everything ready.

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Java 21 (Required for Backend)
```bash
sudo apt install openjdk-21-jdk -y
# Verify
java -version
```

### 3. Install Node.js, NPM, and Yarn (Required for Frontend)
```bash
# Install Node & NPM
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
sudo npm install -g yarn

# Verify
node -v
yarn -v
```

---

## Part 2: Database Setup (Choose ONE)

### Option A: Use Docker (Recommended) 🐳
This is the cleanest way.

1.  **Run MySQL Container:**
    ```bash
    sudo docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
    ```
2.  **Enter Container:**
    ```bash
    sudo docker exec -it mysql-container mysql -u root -p
    # Password is: root
    ```
3.  **Run SQL (Copy-Paste this inside):**
    ```sql
    CREATE DATABASE IF NOT EXISTS mediConnectDb;
    -- Allows connection from outside the container
    CREATE USER 'medi_user'@'%' IDENTIFIED BY 'medi_password';
    GRANT ALL PRIVILEGES ON mediConnectDb.* TO 'medi_user'@'%';
    FLUSH PRIVILEGES;
    EXIT;
    ```

### Option B: Install Directly on Linux
If you don't want Docker, install MySQL directly.

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
# Then log in and create user/db similar to above, but use 'localhost' instead of '%'
```

---

## Part 3: Deploy Backend (Choose ONE)

Navigate to: `Fixing Broken Project/spring_boot_backend_template (Our Work)`

### Option A: Run from Source (Dev Mode) - **EASIEST** ✅
Use this to just "run" it like you do in Windows.

1.  **Create the script:** `nano run.sh`
2.  **Paste this exact content:**
    ```bash
    #!/bin/bash
    
    # Database Config
    export DB_URL="jdbc:mysql://localhost:3306/mediConnectDb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"
    export DB_USERNAME="medi_user"
    export DB_PASSWORD="medi_password" 
    
    # API Keys
    export RAZORPAY_KEY="rzp_test_SA3qJqIkr0IH3u"
    export RAZORPAY_SECRET="rhMAmdHBMZUxX1BUahx0myrG"
    
    echo "🚀 Starting Backend..."
    chmod +x mvnw
    ./mvnw spring-boot:run
    ```
3.  **Run it:**
    ```bash
    chmod +x run.sh
    ./run.sh
    ```

### Option B: Run as JAR (Production Mode) - **IMPRESSIVE** 🏆
Use this to show the interviewer you know how to package apps for a real server.

**Step 1: Build the JAR File**
This bundles your code into a single executable file.
```bash
./mvnw clean package -DskipTests
```
*Wait for "BUILD SUCCESS". This creates a file in `target/spring_boot_backend_template-0.0.1.jar`.*

**Step 2: Create a Production Run Script**
Since you need the environment variables here too, let's make a script called `run_prod.sh`.

```bash
nano run_prod.sh
```

**Paste this exact content (It's the same as `run.sh` but runs the JAR):**
```bash
#!/bin/bash

# --- 1. CONFIGURATION ---
export DB_URL="jdbc:mysql://localhost:3306/mediConnectDb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"
export DB_USERNAME="medi_user"
export DB_PASSWORD="medi_password" 

export RAZORPAY_KEY="rzp_test_SA3qJqIkr0IH3u"
export RAZORPAY_SECRET="rhMAmdHBMZUxX1BUahx0myrG"

# --- 2. RUN THE JAR ---
echo "🚀 Starting Production Backend (JAR)..."
# The 'target' folder is where Maven puts the built file
java -jar target/spring_boot_backend_template-0.0.1.jar
```

**Step 3: Run It**
```bash
chmod +x run_prod.sh
./run_prod.sh
```

---

## Part 4: Deploy Frontend (Choose ONE)

Navigate to: `Fixing Broken Project/mediconnect-frontend (Our Work)`

### Option A: Run from Source (Dev Mode) - **EASIEST** ✅
1.  **Create .env:**
    ```bash
    echo "VITE_API_URL=http://localhost:8080/api" > .env
    ```
2.  **Run:**
    ```bash
    npm install
    npm run dev -- --host
    ```

### Option B: Production Build (Recommended for Interview) 🏆
Minified, fast, and professional.

1.  **Build:**
    ```bash
    npm run build
    ```
2.  **Serve (Run):**
    ```bash
    # Install server tool
    sudo npm install -g serve
    
    # Run the 'dist' folder on port 5173
    serve -s dist -l 5173
    ```

### Option C: Docker 🐳 (The "Pro" Way for Interviews)
*This shows you know modern DevOps. It runs the app inside a container, ensuring it works exactly the same on every machine.*

**Prerequisite:** Make sure Docker is installed (`sudo apt install docker.io`).

**Step 1: Navigate to the Folder**
```bash
cd "Fixing Broken Project/mediconnect-frontend (Our Work)"
```

**Step 2: Create the Environment File**
Docker needs to know where your Backend is.
```bash
# Create the file
nano .env
```
**Paste this inside:**
```env
VITE_API_URL=http://localhost:8080/api
```
*(Save: Ctrl+O, Enter, Ctrl+X)*

**Step 3: Build the Docker Image**
This commands packages your code, Node.js, and all dependencies into a single "Image".
```bash
# -t names the image 'mediconnect-frontend'
# The dot '.' means "look in the current folder"
sudo docker build -t mediconnect-frontend .
```
*Wait for it to finish installing npm dependencies.*

**Step 4: Run the Container**
This actually turns the image on.
```bash
# --name name gives it a name
# --net host lets it see your backend on localhost:8080
# -d means "detach" (run in background, so it doesn't block your terminal)
sudo docker run --name frontend-app --net host -d mediconnect-frontend
```

**Step 5: Verify it's Running**
```bash
# Check running containers
sudo docker ps
```
You should see `mediconnect-frontend` in the list.

**Step 6: Open in Browser**
Go to `http://localhost:5173`.
If it doesn't open, ensure your Linux firewall isn't blocking it (rare on local setups).

**To Stop it later:**
```bash
sudo docker stop frontend-app
sudo docker rm frontend-app
```

---

## 🎯 Cheat Sheet for Interview
*   **Database:** "I used Docker for MySQL to keep my host machine clean."
*   **Security:** "I used Environment Variables for credentials."
*   **Backend:** "I can run it from source for debugging, or package it as a JAR for production performance."
*   **Frontend:** "I built a production-ready `dist` folder for optimized loading."
