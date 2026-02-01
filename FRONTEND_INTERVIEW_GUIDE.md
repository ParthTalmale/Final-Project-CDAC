# 🏥 MediConnect - Frontend Architecture & Interview Guide

> **Technological Stack**: React.js 18, React Router v6, Bootstrap 5, Axios, Context API, Hooks.

This guide is designed to help you explain the **Frontend Architecture** in an interview setting. It highlights your understanding of State Management, Authentication Flow, and Component Design.

---

## ⚛️ 1. React Hooks in Action (The "Must-Know")
*Interview Question: "Which hooks did you use and why?"*

We avoided Class Components entirely. The app is 100% Functional Components using Hooks:

1.  **`useState`**: For local component state.
    *   *Example*: Managing form inputs (`formData`), loading spiders (`loading`), and toggles (`showModal`).
2.  **`useEffect`**: For side effects.
    *   *Example*: Fetching data from the API when a component mounts or when a dependency changes (e.g., re-fetching doctors when `department` filter changes in `ManageDoctor.jsx`).
3.  **`useContext`**: For Global State.
    *   *Example*: `AuthContext` gives every component access to the logged-in user's role and token without "Prop Drilling".
4.  **`useNavigate`**: For programmatic navigation (redirecting to `/login` after logout).

---

## 🔐 2. Authentication Context (`AuthContext.js`)
*Interview Question: "How do you manage the logged-in user's state across pages?"*

We didn't just store the token in LocalStorage; we wrapped the entire app in an **AuthProvider**.

*   **Global State**: `user`, `role`, `token`, `isLoggedIn`.
*   **Initialization**: When the app reloads, `useEffect` in `AuthProvider` checks `localStorage`. If a valid token exists, it restores the session immediately.
*   **Safety**: We strip the `ROLE_` prefix from backend roles to make frontend logic cleaner (`if (role === 'ADMIN')` vs `if (role === 'ROLE_ADMIN')`).

---

## 🛡️ 3. Axios Interceptors (Handling 401s)
*Interview Question: "How do you handle expired tokens automatically?"*

Instead of checking "Is Token Valid?" in every single component, we set up **Axios Interceptors** in `api.js`.

*   **Request Interceptor**: Automatically attaches `Authorization: Bearer <token>` to every outgoing request. Use this to explain how you don't repeat headers manually.
*   **Response Interceptor**: Listens for `401 Unauthorized` responses.
    *   *Scenario*: If the backend restarts or token expires, the interceptor catches the error globally.
    *   *Action*: We can trigger an auto-logout or redirect the user to login (demonstrating proactive error handling).

---

## 🚦 4. Role-Based Rendering (Security on Client)
*Interview Question: "How do you hide Admin pages from Patients?"*

We implemented **Protected Routes** (e.g., `AdminRoute`, `DoctorRoute`).
*   These are wrapper components that check `auth.role`.
*   Logic: `if (user.role !== 'ADMIN') return <Navigate to="/unauthorized" />`.
*   Result: Even if a user types `/admin/dashboard` in the URL, they are blocked.

---

## 🎨 5. Bootstrap Integration
*Interview Question: "Why raw Bootstrap instead of a library like Material UI?"*

For this project, we chose **Bootstrap 5** for two reasons:
1.  **Grid System**: It provides a robust 12-column grid (`row`, `col-md-6`) essential for responsive dashboards.
2.  **Zero-Bundle-Size Overhead**: Unlike heavy component libraries, we used standard CSS classes, keeping the bundle size smaller and the DOM cleaner.

---

## 🧩 6. Interesting Challenges
1.  **Dynamic Dashboards**: The Admin Dashboard isn't static. It fetches real-time metadata (Server-Side counts of Doctors/Nurses) and renders them.
2.  **Search & Filter**: In `ManageDoctor.js`, we implemented server-side filtering. Instead of fetching 1000 doctors and filtering in JS (slow), we send `?keyword=Smith` to the backend, which returns optimized results via SQL queries.
