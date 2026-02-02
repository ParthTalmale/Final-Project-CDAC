import api from "./api";

export const registerStaff = async (staffData) => {
    try {
        const response = await api.post("/auth/register-staff", staffData);
        return response.data;
    } catch (error) {
        console.error("Staff Registration Error:", error);
        throw error.response?.data || "Failed to register staff";
    }
};

export const getAllStaff = async () => {
    try {
        const response = await api.get("/admin/staff");
        return response.data;
    } catch (error) {
        console.error("Fetch Staff Error:", error);
        throw error.response?.data || "Failed to fetch staff directory";
    }
};

export const getAllNurses = async () => {
    try {
        const response = await api.get("/nurse");
        return response.data;
    } catch (error) {
        console.error("Fetch Nurses Error:", error);
        throw error.response?.data || "Failed to fetch nurses";
    }
};

export const getAllDoctors = async (page = 0, size = 6, keyword = "", department = "") => {
    try {
        console.log(`Fetching Doctors: Page=${page}, Keyword='${keyword}', Dept='${department}'`);
        const response = await api.get(`/doctor?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}&department=${encodeURIComponent(department)}`);
        return response.data;
    } catch (error) {
        console.error("Fetch Doctors Error:", error);
        throw error.response?.data || "Failed to fetch doctors";
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await api.get("/admin/dashboard/stats");
        return response.data;
    } catch (error) {
        console.error("Fetch Dashboard Stats Error:", error);
        throw error.response?.data || "Failed to fetch dashboard stats";
    }
};