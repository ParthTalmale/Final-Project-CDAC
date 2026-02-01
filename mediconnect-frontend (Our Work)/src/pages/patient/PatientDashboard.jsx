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
                getUpcomingAppointments(),
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
                    {/* Stats - Dynamic values from API */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <StatCard
                                label="Upcoming Appointments"
                                value={appointmentCount.toString()}
                                icon="bi-calendar2-week"
                                iconColor="#0066ff"
                            />
                        </div>

                        <div className="col-md-3">
                            <StatCard
                                label="Pending Bills"
                                value="$0"
                                icon="bi-credit-card"
                                iconColor="#ff3b3b"
                            />
                        </div>

                        <div className="col-md-3">
                            <StatCard
                                label="Medical Records"
                                value={recordsCount.toString()}
                                icon="bi-file-earmark-medical"
                                iconColor="#00a65a"
                            />
                        </div>

                        <div className="col-md-3">
                            <StatCard
                                label="Active Prescriptions"
                                value={prescriptionCount.toString()}
                                icon="bi-heart-pulse"
                                iconColor="#8a2be2"
                            />
                        </div>
                    </div>

                    {/* Appointments + Reports */}
                    <div className="row g-4">
                        {/* Appointments */}
                        <div className="col-md-6">
                            <div className="card shadow-sm p-3 rounded-4">
                                <div className="d-flex justify-content-between">
                                    <h5 className="fw-bold">Upcoming Appointments</h5>
                                    <button
                                        className="btn btn-dark btn-sm"
                                        onClick={() => navigate('/patient/appointments/1')}
                                    >
                                        + Book New
                                    </button>
                                </div>

                                <div className="mt-3">
                                    {upcomingAppointments.length === 0 ? (
                                        <p className="text-muted text-center py-3">
                                            No upcoming appointments
                                        </p>
                                    ) : (
                                        upcomingAppointments.slice(0, 3).map((appointment, index) => (
                                            <AppointmentCard
                                                key={appointment.id || index}
                                                doctor={appointment.doctorName || 'Doctor'}
                                                dept={appointment.department || 'General'}
                                                date={formatDate(appointment.appointmentDate)}
                                                status={appointment.status || 'Pending'}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reports */}
                        <div className="col-md-6">
                            <div className="card shadow-sm p-3 rounded-4">
                                <div className="d-flex justify-content-between">
                                    <h5 className="fw-bold">Recent Reports</h5>
                                    <button
                                        className="btn btn-outline-dark btn-sm"
                                        onClick={() => navigate('/patient/records')}
                                    >
                                        View All
                                    </button>
                                </div>

                                <div className="mt-3">
                                    {recentReports.length === 0 ? (
                                        <p className="text-muted text-center py-3">
                                            No recent reports
                                        </p>
                                    ) : (
                                        recentReports.slice(0, 3).map((report, index) => (
                                            <ReportCard
                                                key={report.id || index}
                                                title={report.title || report.testName || 'Report'}
                                                doctor={report.doctorName || 'Doctor'}
                                                status={report.status || 'Pending'}
                                                date={formatDate(report.reportDate)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-5">
                        <h5 className="fw-bold mb-3">Quick Actions</h5>

                        <div className="row g-3">
                            <div className="col-md-3">
                                <QuickActionCard
                                    icon="bi-calendar2-plus"
                                    label="Book Appointment"
                                    onClick={() => navigate('/patient/appointments/1')}
                                />
                            </div>

                            <div className="col-md-3">
                                <QuickActionCard
                                    icon="bi-wallet2"
                                    label="Pay Bills"
                                    onClick={() => navigate('/patient/payments')}
                                />
                            </div>

                            <div className="col-md-3">
                                <QuickActionCard
                                    icon="bi-file-earmark-text"
                                    label="View Records"
                                    onClick={() => navigate('/patient/records')}
                                />
                            </div>

                            <div className="col-md-3">
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
