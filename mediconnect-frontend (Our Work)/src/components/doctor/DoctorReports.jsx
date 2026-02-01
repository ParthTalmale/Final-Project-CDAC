import React, { useState, useEffect, useContext } from "react";
import { Card, Table, Button, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { getDoctorReports, downloadMedicalRecord } from "../../services/doctorApi";
import { useAuthContext } from "../../context/AuthContext";

export default function DoctorReports() {
    const { user } = useAuthContext();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && user.name) {
            fetchReports();
        }
    }, [user]);

    const fetchReports = async () => {
        try {
            const data = await getDoctorReports(user.name);
            setReports(data);
        } catch (err) {
            setError("Failed to load reports.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmail = (report) => {
        // Since we don't have patient email in this specific DTO, we might need to ask the user or fetch it.
        // For now, we'll open a blank email template.
        const subject = `Medical Report: ${report.fileName}`;
        const body = `Please find attached the medical report for ${report.recordType}.\n\n[Attach File Manually]`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
    // if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

    return (
        <Container className="p-4">
            <h3 className="fw-bold mb-4">Patient Reports</h3>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {reports.length === 0 ? (
                        <p className="text-center text-muted my-4">No reports found.</p>
                    ) : (
                        <Table hover responsive className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>File Name</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id}>
                                        <td className="fw-bold">{report.fileName}</td>
                                        <td><span className="badge bg-secondary">{report.recordType}</span></td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => downloadMedicalRecord(report.id, report.fileName)}
                                            >
                                                <i className="bi bi-download me-1"></i> Download
                                            </Button>
                                            <Button
                                                variant="outline-dark"
                                                size="sm"
                                                onClick={() => handleEmail(report)}
                                            >
                                                <i className="bi bi-envelope me-1"></i> Email
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}
