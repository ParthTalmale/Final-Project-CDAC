import React, { useState, useEffect } from "react";
import { Card, Table, Button, Spinner, Container, Alert, Modal, Form } from "react-bootstrap";
import { getDoctorAppointments, addPrescription } from "../../services/doctorApi";
import { useAuthContext } from "../../context/AuthContext";

export default function Prescription() {
    const { user, doctorId } = useAuthContext();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (doctorId) {
            fetchAppointments();
        }
    }, [doctorId]);

    const fetchAppointments = async () => {
        try {
            const data = await getDoctorAppointments(doctorId);
            setAppointments(data);
        } catch (err) {
            setError("Failed to load appointments.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrescribeClick = (appt) => {
        setSelectedAppt(appt);
        setNotes("");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!notes) return;
        try {
            await addPrescription({ appointmentId: selectedAppt.appointmentId, notes });
            alert("Prescription Saved!");
            setShowModal(false);

            // Email Logic
            const subject = `Prescription for ${selectedAppt.patientName}`;
            const body = `Hello ${selectedAppt.patientName},\n\nPrescription:\n${notes}\n\nDr. ${selectedAppt.doctorName}`;
            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);

        } catch (err) {
            alert("Failed to save prescription.");
        }
    };

    if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

    return (
        <Container className="p-4">
            <h3 className="fw-bold mb-4">Patient Appointments & Prescriptions</h3>
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {appointments.length === 0 ? (
                        <p className="text-center text-muted my-4">No appointments found.</p>
                    ) : (
                        <Table hover responsive className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Patient</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((a) => (
                                    <tr key={a.appointmentId}>
                                        <td>{a.appointmentDate} <br /><small className="text-muted">{a.startTime}</small></td>
                                        <td className="fw-bold">{a.patientName}</td>
                                        <td>{a.appointmentType}</td>
                                        <td><span className={`badge bg-${a.status === 'SCHEDULED' ? 'primary' : 'secondary'}`}>{a.status}</span></td>
                                        <td>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handlePrescribeClick(a)}
                                            >
                                                <i className="bi bi-plus-circle me-1"></i> Prescribe
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Write Prescription</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Patient:</strong> {selectedAppt?.patientName}</p>
                    <Form.Group>
                        <Form.Label>Prescription Notes / Medicines</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter medicines and dosage..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save & Email</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
