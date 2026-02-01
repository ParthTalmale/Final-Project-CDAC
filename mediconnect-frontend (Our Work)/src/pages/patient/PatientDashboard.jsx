import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import PageTitle from "../../components/common/PageTitle";
import StatCard from "../../components/patient/StatCard";
import AppointmentCard from "../../components/patient/AppointmentCard";
import ReportCard from "../../components/patient/ReportCard";
import QuickActionCard from './../../components/patient/QuickAction';
import {
    getUpcomingAppointments,
    getActivePrescriptions,
    getRecentReports,
    getMedicalRecords
} from "../../services/patientApi";
import useAuth from "../../hooks/useAuth";

/**
 * Patient Dashboard Component
 * 
 * Displays an overview of the patient's health information including:
 * - Statistics (appointments, records, prescriptions)
 * - Upcoming appointments
 * - Recent reports
 * - Quick action buttons
 * 
 * Uses the patientId from auth context for all API calls.
 * 
 * @author MediConnect Team
 */
export default function PatientDashboard() {
    const navigate = useNavigate();
    const { user, patientId } = useAuth();

    // State for dashboard data
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [activePrescriptions, setActivePrescriptions] = useState([]);
    const [recentReports, setRecentReports] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch all dashboard data
     */
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel for better performance
            const [appointments, prescriptions, reports, records] = await Promise.allSettled([
                getUpcomingAppointments(patientId),
                getActivePrescriptions(),
                getRecentReports(),
                getMedicalRecords()
            ]);

            // Update state with fetched data (handle both success and failure cases)
            if (appointments.status === 'fulfilled' && appointments.value) {
                setUpcomingAppointments(appointments.value);
            }

            if (prescriptions.status === 'fulfilled' && prescriptions.value) {
                setActivePrescriptions(prescriptions.value);
            }

            if (reports.status === 'fulfilled' && reports.value) {
                setRecentReports(reports.value);
            }

            if (records.status === 'fulfilled' && records.value) {
                setMedicalRecords(records.value);
            }

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load some dashboard data. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    /**
     * Get user's first name for greeting
     */
    const getFirstName = () => {
        if (!user?.name) return 'Patient';
        return user.name.split(' ')[0];
    };

    // Calculate stats
    const appointmentCount = Array.isArray(upcomingAppointments) ? upcomingAppointments.length : 0;
    const recordsCount = Array.isArray(medicalRecords) ? medicalRecords.length : 0;
    const prescriptionCount = Array.isArray(activePrescriptions) ? activePrescriptions.length : 0;

    return (
        <div className="container-fluid">
            {/* Title - Uses actual user name */}
            <PageTitle
                title={`Welcome Back, ${getFirstName()}!`}
                subtitle="Here's an overview of your health information"
            />

            {/* Error Alert */}
            {error && (
                <Alert variant="warning" dismissible onClose={() => setError(null)} className="mb-4">
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading your dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Upcoming Appointments (Full Width) */}
                    <div className="card shadow-sm p-4 rounded-4 mb-5 border-0">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Upcoming Appointments</h5>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/patient/appointments/1')}
                            >
                                <i className="bi bi-plus-lg me-2"></i>Book New
                            </button>
                        </div>

                        {upcomingAppointments.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded-3">
                                <i className="bi bi-calendar-x text-muted fs-1 mb-3"></i>
                                <p className="text-muted mb-3">No upcoming appointments scheduled.</p>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => navigate('/patient/appointments/1')}
                                >
                                    Book Your First Appointment
                                </button>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {upcomingAppointments.map((appointment, index) => (
                                    <div className="col-md-4" key={appointment.id || index}>
                                        <AppointmentCard
                                            doctor={appointment.doctorName || 'Doctor'}
                                            dept={appointment.department || 'General'}
                                            date={formatDate(appointment.appointmentDate)}
                                            status={appointment.status || 'Pending'}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h5 className="fw-bold mb-3">Quick Actions</h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <QuickActionCard
                                    icon="bi-calendar2-plus"
                                    label="Book Appointment"
                                    onClick={() => navigate('/patient/appointments/1')}
                                />
                            </div>

                            <div className="col-md-6">
                                <QuickActionCard
                                    icon="bi-telephone"
                                    label="Emergency Contacts"
                                    onClick={() => navigate('/patient/emergency')}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
