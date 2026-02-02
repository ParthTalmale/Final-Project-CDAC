import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { useAuthContext } from "../../context/AuthContext"; // Fix import
import {
    getMedicalRecords,
    getUpcomingAppointments,
    uploadMedicalRecord,
    fetchLastVisitDate,
    getDoctorsConsultedCount,
    getCompletedAppointmentsCount
} from "../../services/patientApi";
import { downloadMedicalRecord } from "../../services/doctorApi"; // Reuse verify download

export default function PatientDashboard() {
    const { user, patientId } = useAuthContext();
    const [stats, setStats] = useState({
        lastVisit: "N/A",
        doctorsCount: 0,
        completedAppointments: 0
    });
    const [reports, setReports] = useState([]);
    const [appointments, setAppointments] = useState([]); // For upload dropdown
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState({
        appointmentId: "",
        recordType: "Lab Report",
        file: null
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user && patientId) {
            loadDashboardData();
        }
    }, [user, patientId]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [lastVisit, docCount, completedAppts, myReports, upcomingAppts] = await Promise.all([
                fetchLastVisitDate(),
                getDoctorsConsultedCount(patientId),
                getCompletedAppointmentsCount(patientId),
                getMedicalRecords(), // These are reports
                getUpcomingAppointments(patientId)
            ]);

            setStats({
                lastVisit: lastVisit || "N/A",
                doctorsCount: docCount,
                completedAppointments: completedAppts
            });
            setReports(myReports || []);
            setAppointments(upcomingAppts || []);

        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = (e) => {
        if (e.target.name === "file") {
            setUploadData({ ...uploadData, file: e.target.files[0] });
        } else {
            setUploadData({ ...uploadData, [e.target.name]: e.target.value });
        }
    };

    const handleUploadSubmit = async () => {
        if (!uploadData.appointmentId || !uploadData.file) {
            setMessage({ type: "danger", text: "Please select an appointment and a file." });
            return;
        }

        try {
            await uploadMedicalRecord(uploadData.appointmentId, uploadData.recordType, uploadData.file);
            setMessage({ type: "success", text: "Report uploaded successfully!" });
            setShowUploadModal(false);
            loadDashboardData(); // Refresh list
        } catch (error) {
            setMessage({ type: "danger", text: "Upload failed. Please try again." });
        }
    };

    if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Welcome back, {user?.name}</h2>
                <Button variant="primary" onClick={() => window.location.href = '/patient/appointments/1'}>
                    <i className="bi bi-plus-lg me-2"></i>Book New Appointment
                </Button>
            </div>

            {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}

            {/* Upcoming Appointments Section */}
            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white py-3">
                    <h5 className="mb-0">Upcoming Appointments</h5>
                </Card.Header>
                <Card.Body>
                    {appointments.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted mb-3">No upcoming appointments scheduled.</p>
                            <Button variant="outline-primary" onClick={() => window.location.href = '/patient/appointments/1'}>
                                Book Your First Appointment
                            </Button>
                        </div>
                    ) : (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Doctor</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt) => (
                                    <tr key={appt.appointmentId}>
                                        <td>
                                            <div className="fw-bold">{appt.appointmentDate}</div>
                                            <small className="text-muted">{appt.appointmentTime}</small>
                                        </td>
                                        <td>{appt.doctorName}</td>
                                        <td>{appt.department}</td>
                                        <td>
                                            <span className={`badge bg-${appt.status === 'CONFIRMED' ? 'success' : 'warning'}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Quick Actions */}
            <h5 className="mb-3">Quick Actions</h5>
            <Row>
                <Col md={6} className="mb-3">
                    <Card className="h-100 shadow-sm border-0 hover-card" role="button" onClick={() => window.location.href = '/patient/appointments/1'}>
                        <Card.Body className="d-flex align-items-center p-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                <i className="bi bi-calendar-plus text-primary fs-4"></i>
                            </div>
                            <div>
                                <h6 className="mb-1">Book Appointment</h6>
                                <small className="text-muted">Schedule a visit with detailed consultation</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="h-100 shadow-sm border-0 hover-card" role="button" onClick={() => window.location.href = '/patient/emergency'}>
                        <Card.Body className="d-flex align-items-center p-4">
                            <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                                <i className="bi bi-telephone text-danger fs-4"></i>
                            </div>
                            <div>
                                <h6 className="mb-1">Emergency Contacts</h6>
                                <small className="text-muted">Manage your emergency contact details</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Upload Modal (Kept just in case logic needs it, but button removed from UI) */}
            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Medical Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Select Appointment</Form.Label>
                            <Form.Select
                                name="appointmentId"
                                value={uploadData.appointmentId}
                                onChange={handleUploadChange}
                            >
                                <option value="">-- Select Related Appointment --</option>
                                {appointments.map(appt => (
                                    <option key={appt.appointmentId} value={appt.appointmentId}>
                                        {appt.doctorName} - {appt.appointmentDate}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Record Type</Form.Label>
                            <Form.Select
                                name="recordType"
                                value={uploadData.recordType}
                                onChange={handleUploadChange}
                            >
                                <option>Lab Report</option>
                                <option>X-Ray</option>
                                <option>Prescription (External)</option>
                                <option>Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Select File (PDF/Image)</Form.Label>
                            <Form.Control
                                type="file"
                                name="file"
                                onChange={handleUploadChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleUploadSubmit}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
