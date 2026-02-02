import api from './api';

export const getAllDepartments = async () => {
    try {
        const response = await api.get("/departments");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to fetch departments";
    }
};
