# MediConnect Backend - Spring Boot with JWT Security

## Project Overview
This project is a Backend for a Hospital Management System built using **Spring Boot**. It adheres to a clean **MVC (Model-View-Controller)** architecture and uses **Spring Security** with **JWT (JSON Web Token)** for stateless authentication.

---

## 🔐 Security Implementation (Interview Prep)

You have integrated Spring Security to secure the application. Here is a breakdown of the components you implemented and *why*:

### 1. **Dependencies** (`pom.xml`)
- Added `spring-boot-starter-security` for the core security framework.
- Added `jjwt-api`, `jjwt-impl`, `jjwt-jackson` for creating and parsing JSON Web Tokens.

### 2. **JWT Utility** (`JwtUtils.java`)
- **Role**: The "keymaster" class.
- **Function**:
    - Generates tokens using a standard algorithm (HMAC-SHA).
    - Signs tokens with a `secret` key (so nobody can fake them).
    - Extracts the `username` (email) from the token.
    - Validates if a token is authentic and not expired.

### 3. **The Filter** (`JwtAuthenticationFilter.java`)
- **Role**: The "gatekeeper" (intercepts every request).
- **How it works**:
    1.  Checks the `Authorization` header for a "Bearer [token]" string.
    2.  If found, it calls `JwtUtils` to validate it.
    3.  If valid, it extracts the user details and loads them into Spring **SecurityContext**.
    4.  *Crucial*: If this step succeeds, Spring knows "Who you are" for the rest of the request.

### 4. **User Details Service** (`CustomUserDetailsService.java`)
- **Role**: The "data fetcher".
- **Why?**: Spring Security doesn't know about your `User` entity or your database.
- **Function**: It translates your database `User` object into a `UserDetails` object that Spring Security understands.

### 5. **Configuration** (`SecurityConfiguration.java`)
- **Role**: The "rulebook".
- **Key Settings**:
    - **CSRF Disabled**: Because we are using JWT (stateless), we don't need CSRF protection (mainly for session-based auth).
    - **Stateless Session**: We tell Spring *not* to create `JSESSIONID` cookies. Every request must bring its own token.
    - **Public vs Protected**: We opened `/api/auth/**` (login) to everyone, but locked everything else.

### 6. **Authentication Flow**
1.  Client sends `POST /api/auth/login` with Email/Password.
2.  `AuthenticationManager` verifies credentials.
3.  If correct, `JwtUtils` generates a Token.
4.  Server responds with `{ token: "ey..." }`.
5.  Client sends this token in the header (`Authorization: Bearer ey...`) for all future requests.



### 7. **API Endpoints**


#### **Open Endpoints (No Token Required)**
*   `POST /api/auth/login` - Authenticate and get token.
*   `POST /api/auth/register-patient` - Register a new PATIENT (Public).

#### **Protected Endpoints (Token Required)**
*   `POST /api/auth/register-staff` - Register Admin/Doctor/Nurse (Requires **ROLE_ADMIN**).
*   `GET /api/auth/me` - Get current user details.

#### **Role Verification Endpoint (Token Required)**
*   `GET /api/auth/me` - Returns current user details and **Role**.
    *   **Usage**: Call this on frontend app load to decide where to redirect the user.
    *   **Header**: `Authorization: Bearer <token>`
    *   **Response**: `{ "id": 1, "name": "...", "role": "ROLE_DOCTOR" }`

---

## 🛠️ How to Run
1.  **Configure Database**: Update `src/main/resources/application.properties` with your MySQL credentials.
2.  **Build**: Run `mvn clean install`.
3.  **Run**: `mvn spring-boot:run`.

## 🧪 Testing with Postman
1.  **Login**:
    - POST `http://localhost:8080/api/auth/login`
    - Body (JSON):
      ```json
      {
        "email": "doctor@example.com",
        "password": "password123"
      }
      ```
2.  **Access Protected Route**:
    - GET `http://localhost:8080/api/doctors`
    - Headers: `Authorization`: `Bearer <paste_token_here>`

---

## ❓ Common Interview Questions
**Q: Why use JWT instead of Sessions?**
*A: JWT is stateless. The server doesn't need to store session data in memory. This makes it easier to scale (you can have multiple servers without sharing session memory).*

**Q: What is the filter chain?**
*A: It's a series of filters that every request passes through. We added our `JwtAuthenticationFilter` *before* the standard `UsernamePasswordAuthenticationFilter` to check for tokens first.*

**Q: Where is the password stored?**
*A: In the database, but **encrypted** using BCrypt. We never store plain passwords.*
