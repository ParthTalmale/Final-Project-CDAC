import api, { publicApi, setToken, setStoredUser, clearAuthData, getToken } from "./api";

export const loginUser = async (email, password) => {
    try {
        // Use publicApi to avoid sending potentially bad tokens
        const response = await publicApi.post("/auth/login", { email, password });
        const data = response.data;

        // Store token for subsequent requests
        setToken(data.token);

        // Prepare user object for storage
        const user = {
            userId: data.userId,
            name: data.name,
            email: data.username,
            role: data.role,
            patientId: data.patientId,
            doctorId: data.doctorId,
            adminId: data.adminId
        };

        // Store user data
        setStoredUser(user);

        return {
            success: true,
            user,
            token: data.token
        };
    } catch (error) {
        console.error("Login error:", error);
        throw error.response?.data || "Login failed";
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/auth/me");
        return response.data;
    } catch (error) {
        console.error("Get Current User Error:", error);
        throw error;
    }
};

export const registerPatient = async (userData) => {
    try {
        // Use publicApi to avoid sending potentially bad tokens
        const response = await publicApi.post("/auth/register-patient", userData);
        return {
            success: true,
            user: response.data,
            message: 'Registration successful! Please login to continue.'
        };
    } catch (error) {
        console.error("Registration error:", error);
        throw error.response?.data || "Registration failed";
    }
};

/**
 * Logout user
 * Clears all stored authentication data
 */
export function logoutUser() {
    clearAuthData();
}

export default {
    loginUser,
    registerPatient,
    getCurrentUser,
    logoutUser
};
