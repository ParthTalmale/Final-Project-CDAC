# 🏥 MediConnect - Backend Architecture & Interview Guide

> **Technological Stack**: Java, Spring Boot 3, Spring Security 6, JWT, Hibernate/JPA, MySQL, Razorpay API, ModelMapper.

This guide is designed to help you explain the **Backend Architecture** in an interview setting. It focuses on the "Hard Parts" — the design decisions, security implementations, and complex integrations.

---

## 🔐 1. Spring Security & JWT Implementation (The "Must-Know")
*Interview Question: "How did you handle Authentication and Authorization?"*

We moved away from stateful sessions (Cookies/Session IDs) to a **Stateless JWT (JSON Web Token)** architecture. This makes the backend scalable and ready for mobile/microservices.

### The Flow:
1.  **Login**: User sends `email/password` -> `AuthController` -> `AuthenticationManager` verifies credentials.
2.  **Token Generation**: If valid, we generate a signed JWT (`JwtUtils`) containing the user's **Email** and **Role**.
3.  **The Filter Chain** (`SecurityConfiguration.java`):
    *   We disabled default CSRF (since we use JWTs and non-browser clients).
    *   **`JwtAuthenticationFilter`**: This custom filter intercepts *every* request.
        *   It extracts the `Bearer` token from the header.
        *   Validates the signature (HMAC-SHA256).
        *   Loads user details (`CustomUserDetailsService`).
        *   Sets the `SecurityContext` so Spring knows "Who is this user".
4.  **Role-Based Access**: We use `@EnableMethodSecurity` to allow annotations like `@PreAuthorize("hasRole('ADMIN')")` on Controllers, ensuring strict access control.

---

## 💸 2. Payment Integration (Razorpay)
*Interview Question: "How did you implement secure payments?"*

We did NOT store card details. We delegated sensitive handling to **Razorpay** to maintain PCI compliance.

### The Lifecycle:
1.  **Frontend**: User clicks "Pay" -> Backend creates an **Order** (`OrderController`).
    *   *Why Backend?* To secure the amount. If frontend created the order, a user could manipulate the price to ₹1.
2.  **Razorpay**: Returns an `order_id`.
3.  **Frontend**: Opens Razorpay Overlay -> User pays -> Returns `payment_id` and `signature`.
4.  **Verification**: Backend receives `payment_id`, `order_id`, and `signature`.
    *   We re-hash the data using our **Secret Key**.
    *   If `calculated_hash == received_signature`, the payment is authentic.

---

## 🏛️ 3. Database Design & DTO Pattern
*Interview Question: "Why do you use DTOs instead of Entities?"*

We used the **Data Transfer Object (DTO)** pattern strictly to decouple our internal Database Schema (`Entities`) from the API response (`DTOs`).

*   **Security**: Prevents exposing sensitive fields (like `password`, `created_at`, or internal flags) to the frontend.
*   **Performance**: In the **Admin Dashboard**, we didn't fetch full `User` objects. We used JPQL/Streams to count stats and projected them into a lightweight `AdminDashboardStatsDto`.
*   **Validation**: DTOs carry Java Bean Validation annotations (`@NotNull`, `@Email`), ensuring data is clean *before* it reaches the service layer.

---

## 🔄 4. Exception Handling
*Interview Question: "How do you handle errors globally?"*

We implemented a **Global Exception Handler** (`@ControllerAdvice`).
*   Instead of sending huge Stack Traces to the user (security risk), we catch specific exceptions (`ResourceNotFoundException`, `BadCredentialsException`).
*   We return a standard `ApiResponse` JSON with a meaningful error message and the correct HTTP Status Code (404, 401, 400).

---

## ⚙️ 5. Key Challenges Solved
1.  **Bi-Directional Mapping**: Handling `User` <-> `Patient` relationships. We had to ensure that when a User registers, the specific Role entity (Patient/Doctor) is correctly linked without creating circular dependency issues during JSON serialization (solved via DTOs).
2.  **Dashboard Performance**: The Admin Dashboard required aggregating data from 3 tables (`Doctors`, `Nurses`, `Departments`). Instead of 3 separate API calls, we built a single optimized endpoint.

---

## 🚀 Deployment Considerations (If asked)
*   **Dockerization**: The app can be wrapped in a container (`Dockerfile` provided).
*   **Profile Management**: We use `application.properties` to support different environments (Dev vs Prod database URLs).
