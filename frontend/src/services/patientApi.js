import api from './api';

/**
 * Patient API Service
 * 
 * Provides all patient-related API calls using the centralized axios instance.
 * The axios instance automatically handles:
 * - JWT token injection via request interceptor
 * - Authentication error handling via response interceptor
 * - Base URL configuration
 * 
 * Industry Standard Implementation:
 * - Uses centralized axios instance
 * - No manual token handling needed
 * - Consistent error handling
 * - Proper async/await patterns
 * 
 * @author MediConnect Team
 */

/**
 * Get upcoming appointments for the logged-in patient
 * @returns {Promise<Array>} List of upcoming appointments
 */
export async function getUpcomingAppointments(patientId) {
    try {
        const response = await api.get(`/appointments/patient/${patientId}/upcoming`);
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
        throw error;
    }
}

/**
 * Get medical records for the logged-in patient
 * @returns {Promise<Array>} List of medical records
 */
export async function getMedicalRecords() {
    try {
        const response = await api.get('/patient/medicalRecords');
        return response.data;
    } catch (error) {
        console.error("Error fetching medical records:", error);
        throw error;
    }
}

/**
 * Get active prescriptions for the logged-in patient
 * @returns {Promise<Array>} List of active prescriptions
 */
export async function getActivePrescriptions() {
    try {
        const response = await api.get('/patient/activePrescriptions');
        return response.data;
    } catch (error) {
        console.error("Error fetching active prescriptions:", error);
        throw error;
    }
}

/**
 * Get recent diagnostic reports for the logged-in patient
 * @returns {Promise<Array>} List of recent reports
 */
export async function getRecentReports() {
    try {
        const response = await api.get('/patient/recentReports');
        return response.data;
    } catch (error) {
        console.error("Error fetching recent reports:", error);
        throw error;
    }
}

/**
 * Get count of completed appointments for a patient
 * @param {number} patientId - Patient ID
 * @returns {Promise<number>} Count of completed appointments
 */
export async function getCompletedAppointmentsCount(patientId) {
    try {
        const response = await api.get(`/appointments/patient/${patientId}/completed/count`);
        return response.data;
    } catch (error) {
        console.error("Error fetching completed appointments count:", error);
        throw error;
    }
}

/**
 * Get count of unique doctors consulted by a patient
 * @param {number} patientId - Patient ID
 * @returns {Promise<number>} Count of doctors consulted
 */
export async function getDoctorsConsultedCount(patientId) {
    try {
        const response = await api.get(`/appointments/patient/${patientId}/doctors/count`);
        return response.data;
    } catch (error) {
        console.error("Error fetching doctors consulted count:", error);
        throw error;
    }
}

/**
 * Get all available doctors
 * @returns {Promise<Array>} List of all doctors
 */
export async function getAllDoctors() {
    try {
        // Use the patient-specific endpoint to avoid Admin filter issues
        const response = await api.get('/patient/allDoctors');
        return response.data;
    } catch (error) {
        console.error("Error fetching all doctors:", error);
        throw error;
    }
}

/**
 * Get doctors filtered by branch/department
 * @param {string} branch - Branch/department name
 * @returns {Promise<Array>} List of doctors in the specified branch
 */
export async function getDoctorsByBranch(branch) {
    try {
        const response = await api.get('/patient/doctorsByBranch', {
            params: { branch }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching doctors by branch:", error);
        throw error;
    }
}

/**
 * Get emergency contacts for the logged-in patient
 * @returns {Promise<Array>} List of emergency contacts
 */
export async function fetchEmergencyContacts() {
    try {
        const response = await api.get('/patient/emergencyContacts');
        return response.data;
    } catch (error) {
        console.error("Error fetching emergency contacts:", error);
        throw error;
    }
}

/**
 * Add a new emergency contact
 * @param {object} contactData - Emergency contact data
 * @returns {Promise<object>} Created emergency contact
 */
export async function addEmergencyContact(contactData) {
    try {
        const response = await api.post('/patient/emergencyContacts', contactData);
        return response.data;
    } catch (error) {
        console.error("Error adding emergency contact:", error);
        throw error;
    }
}

/**
 * Update an emergency contact
 * @param {number} contactId - Contact ID
 * @param {object} contactData - Updated contact data
 * @returns {Promise<object>} Updated emergency contact
 */
export async function updateEmergencyContact(contactId, contactData) {
    try {
        const response = await api.put(`/patient/emergencyContacts/${contactId}`, contactData);
        return response.data;
    } catch (error) {
        console.error("Error updating emergency contact:", error);
        throw error;
    }
}

/**
 * Delete an emergency contact
 * @param {number} contactId - Contact ID
 * @returns {Promise<void>}
 */
export async function deleteEmergencyContact(contactId) {
    try {
        await api.delete(`/patient/emergencyContacts/${contactId}`);
    } catch (error) {
        console.error("Error deleting emergency contact:", error);
        throw error;
    }
}

/**
 * Get last visit date for the logged-in patient
 * @returns {Promise<string>} Last visit date
 */
export async function fetchLastVisitDate() {
    try {
        const response = await api.get('/patient/lastVisitDate');
        return response.data;
    } catch (error) {
        console.error("Error fetching last visit date:", error);
        throw error;
    }
}

/**
 * Get count of lab reports for the logged-in patient
 * @returns {Promise<number>} Lab reports count
 */
export async function fetchLabReportsCount() {
    try {
        const response = await api.get('/patient/labReportsCount');
        return response.data;
    } catch (error) {
        console.error("Error fetching lab reports count:", error);
        throw error;
    }
}

/**
 * Get patient dashboard data (aggregate endpoint)
 * @param {number} patientId - Patient ID
 * @returns {Promise<object>} Dashboard data including stats and recent items
 */
export async function getPatientDashboard(patientId) {
    try {
        const response = await api.get(`/patient/${patientId}/dashboard`);
        return response.data;
    } catch (error) {
        console.error("Error fetching patient dashboard:", error);
        throw error;
    }
}

/**
 * Get available appointment slots
 * @param {object} params - Request body
 * @param {number} params.doctorId - Doctor ID
 * @param {string} params.date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Available time slots
 */
export async function getAvailableSlots(params) {
    try {
        const response = await api.post('/appointments/slot', params);
        return response.data;
    } catch (error) {
        console.error("Error fetching available slots:", error);
        throw error;
    }
}

/**
 * Hold an appointment slot
 * @param {object} slotData - Slot details
 * @returns {Promise<object>} Hold slot response
 */
export async function holdSlot(slotData) {
    try {
        const response = await api.post('/appointments/holdSlot', slotData);
        return response.data;
    } catch (error) {
        console.error("Error holding slot:", error);
        throw error;
    }
}

/**
 * Create a payment order
 * @param {object} orderData - Order details
 * @returns {Promise<object>} Order response
 */
export async function createOrder(orderData) {
    try {
        const response = await api.post('/billing/create-order', orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

/**
 * Verify payment
 * @param {object} paymentData - Payment details
 * @returns {Promise<object>} Verification response
 */
export async function verifyPayment(paymentData) {
    try {
        const response = await api.post('/billing/verify-order', paymentData);
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
}

/**
 * Book an appointment
 * @param {object} appointmentData - Appointment details
 * @param {number} appointmentData.doctorId - Doctor ID
 * @param {number} appointmentData.patientId - Patient ID
 * @param {string} appointmentData.date - Appointment date
 * @param {string} appointmentData.time - Appointment time slot
 * @param {string} appointmentData.reason - Reason for visit
 * @returns {Promise<object>} Created appointment
 */
export async function bookAppointment(appointmentData) {
    try {
        const response = await api.post('/appointments/book', appointmentData);
        return response.data;
    } catch (error) {
        console.error("Error booking appointment:", error);
        throw error;
    }
}

/**
 * Cancel an appointment
 * @param {number} appointmentId - Appointment ID
 * @returns {Promise<void>}
 */
export async function cancelAppointment(appointmentId) {
    try {
        await api.delete(`/appointments/${appointmentId}`);
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        throw error;
    }
}

/**
 * Get patient profile information
 * @param {number} patientId - Patient ID
 * @returns {Promise<object>} Patient profile data
 */
export async function getPatientProfile(patientId) {
    try {
        const response = await api.get(`/patient/${patientId}/profile`);
        return response.data;
    } catch (error) {
        console.error("Error fetching patient profile:", error);
        throw error;
    }
}

/**
 * Update patient profile
 * @param {number} patientId - Patient ID
 * @param {object} profileData - Updated profile data
 * @returns {Promise<object>} Updated profile
 */
export async function updatePatientProfile(patientId, profileData) {
    try {
        const response = await api.put(`/patient/${patientId}/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error("Error updating patient profile:", error);
        throw error;
    }
}

export default {
    getUpcomingAppointments,
    getMedicalRecords,
    getActivePrescriptions,
    getRecentReports,
    getCompletedAppointmentsCount,
    getDoctorsConsultedCount,
    getAllDoctors,
    getDoctorsByBranch,
    fetchEmergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    fetchLastVisitDate,
    fetchLabReportsCount,
    getPatientDashboard,
    getAvailableSlots,
    holdSlot,
    createOrder,
    verifyPayment,
    bookAppointment,
    cancelAppointment,
    getPatientProfile,
    updatePatientProfile,
};
