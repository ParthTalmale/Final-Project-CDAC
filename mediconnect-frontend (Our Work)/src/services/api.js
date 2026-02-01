import axios from "axios";

// Token storage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// 1. Private API (Attaches Token)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ... (INTERIM CODE) ...

// 2. Public API (No Token - for Login/Register)
export const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Get stored authentication token
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set authentication token in storage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove authentication token from storage
 */
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * Get stored user data
 * @returns {object|null} User object or null
 */
export const getStoredUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

/**
 * Set user data in storage
 * @param {object} user - User data object
 */
export const setStoredUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Remove user data from storage
 */
export const removeStoredUser = () => {
    localStorage.removeItem(USER_KEY);
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
    removeToken();
    removeStoredUser();
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
    return !!getToken();
};

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = getToken(); // Use helper function
        // console.log("API Interceptor: Checking token...");
        if (token) {
            // console.log("API Interceptor: Attaching Token");
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("API Interceptor: No token found.");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



export default api;
