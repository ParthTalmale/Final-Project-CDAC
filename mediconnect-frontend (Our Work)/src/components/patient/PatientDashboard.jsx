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
            <h2 className="mb-4">Welcome back, {user?.name}</h2>

            {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}

            {/* Stats Row */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm p-3">
                        <Card.Body>
                            <h5>Last Visit</h5>
                            <h3 className="text-primary">{stats.lastVisit}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm p-3">
                        <Card.Body>
                            <h5>Doctors Consulted</h5>
                            <h3 className="text-success">{stats.doctorsCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm p-3">
                        <Card.Body>
                            <h5>Completed Checks</h5>
                            <h3 className="text-info">{stats.completedAppointments}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Reports Section */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0">My Medical Records</h5>
                    <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                        <i className="bi bi-upload me-2"></i> Upload Report
                    </Button>
                </Card.Header>
                <Card.Body>
                    {reports.length === 0 ? (
                        <p className="text-muted text-center">No medical records found.</p>
                    ) : (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>File Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id}>
                                        <td>{report.appointmentDate || "N/A"}</td>
                                        <td><span className="badge bg-secondary">{report.recordType}</span></td>
                                        <td>{report.fileName}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => downloadMedicalRecord(report.id, report.fileName)}
                                            >
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Upload Modal */}
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
                            <Form.Text className="text-muted">
                                Records must be linked to a specific appointment.
                            </Form.Text>
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
