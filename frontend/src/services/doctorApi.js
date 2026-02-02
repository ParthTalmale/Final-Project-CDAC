import api from "./api";

export const getDoctorDashboardStats = async () => {
    try {
        const response = await api.get("/doctor/dashboard");
        return response.data;
    } catch (error) {
        console.error("Error fetching doctor dashboard:", error);
        throw error;
    }
};

export const getDoctorReports = async (doctorName) => {
    try {
        const response = await api.get(`/medical-records/doctor/${doctorName}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching doctor reports:", error);
        throw error;
    }
};

export const downloadMedicalRecord = async (id, fileName) => {
    try {
        const response = await api.get(`/medical-records/download/${id}`, {
            responseType: 'blob', // Important for files
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
};

export const getDoctorPrescriptions = async (email) => {
    try {
        const response = await api.get(`/prescription/doctor/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        throw error;
    }
}


export const getWeeklyAvailability = async (doctorId) => {
    try {
        const response = await api.get(`/doctor/availability/${doctorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching availability:", error);
        throw error;
    }
};

export const getDoctorAppointments = async (doctorId) => {
    try {
        const response = await api.get(`/appointments/doctor/${doctorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
};

export const cancelAppointment = async (appointmentId) => {
    try {
        const response = await api.post(`/appointments/cancel/${appointmentId}`);
        return response.data;
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        throw error;
    }
};

export const completeAppointment = async (appointmentId) => {
    try {
        const response = await api.post(`/appointments/complete/${appointmentId}`);
        return response.data;
    } catch (error) {
        console.error("Error completing appointment:", error);
        throw error;
    }
};

export const addPrescription = async (data) => {
    try {
        const response = await api.post("/prescription/add", data);
        return response.data;
    } catch (error) {
        console.error("Error creating prescription:", error);
        throw error;
    }
};

export const updateAvailability = async (data) => {
    try {
        const response = await api.post("/doctor/updateAvailability", data); // Assuming api.js has baseURL with /api
        return response.data;
    } catch (error) {
        console.error("Error updating availability:", error);
        throw error;
    }
};