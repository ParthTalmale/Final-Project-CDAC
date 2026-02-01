import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { getDoctorDashboardStats } from "../../services/doctorApi";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const data = await getDoctorDashboardStats();
            setStats(data);
        } catch (err) {
            setError("Failed to load dashboard data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

    return (
        <div className="p-4">

            {/* Page Title */}
            <h3 className="fw-bold">Doctor Dashboard</h3>
            <p className="text-muted">Overview of your schedule and patients</p>

            {/* Top Stats */}
            <Row className="gy-3 mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm border-0 h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-1 text-muted">My Patients</p>
                                <h2 className="fw-bold mb-0">{stats ? stats.totalPatients : 0}</h2>
                            </div>
                            <div className="bg-light p-3 rounded-circle">
                                <i className="bi bi-people fs-4 text-primary"></i>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="p-3 shadow-sm border-0 h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-1 text-muted">Today's Appointments</p>
                                <h2 className="fw-bold mb-0">{stats ? stats.todayTotalAppointments : 0}</h2>
                                <small className="text-warning fw-bold">{stats ? stats.todayRemainingAppointments : 0} Remaining</small>
                            </div>
                            <div className="bg-light p-3 rounded-circle">
                                <i className="bi bi-calendar-check fs-4 text-success"></i>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="gy-4 mb-4">

                {/* Today's Appointments List */}
                <Col md={7}>
                    <Card className="p-3 shadow-sm border-0 h-100">
                        <div className="d-flex justify-content-between mb-3 align-items-center">
                            <h5 className="fw-bold mb-0">Today's Schedule</h5>
                            <Button variant="outline-primary" size="sm" onClick={() => navigate("/doctor/appointments")}>View All</Button>
                        </div>

                        {stats && stats.todaysSchedule && stats.todaysSchedule.length > 0 ? (
                            stats.todaysSchedule.map((appt, i) => (
                                <Card key={i} className="p-3 mb-2 border-0 bg-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-bold">{appt.startTime} - {appt.endTime}</div>
                                            <div className="text-primary">{appt.patientName}</div>
                                            <small className="text-muted">{appt.appointmentType}</small>
                                        </div>
                                        <span className={`badge rounded-pill ${appt.status === 'COMPLETED' ? 'bg-success' : appt.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted text-center py-4">No appointments scheduled for today.</p>
                        )}
                    </Card>
                </Col>

                {/* Recent Reports List */}
                <Col md={5}>
                    <Card className="p-3 shadow-sm border-0 h-100">
                        <div className="d-flex justify-content-between mb-3 align-items-center">
                            <h5 className="fw-bold mb-0">Recent Reports</h5>
                            <Button variant="outline-primary" size="sm" onClick={() => navigate("/doctor/reports")}>View All</Button>
                        </div>

                        {stats && stats.recentReports && stats.recentReports.length > 0 ? (
                            stats.recentReports.map((report, i) => (
                                <Card key={i} className="p-2 mb-2 border-0 border-bottom">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-bold text-truncate" style={{ maxWidth: "150px" }}>{report.fileName}</div>
                                            <small className="text-muted">{report.recordType}</small>
                                        </div>
                                        <Button variant="link" size="sm" className="text-decoration-none">View</Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted text-center py-4">No recent reports found.</p>
                        )}
                    </Card>
                </Col>

            </Row>

            {/* Quick Actions */}
            <Card className="p-4 shadow-sm border-0">
                <h5 className="fw-bold mb-4">Quick Actions</h5>
                <Row className="gy-3">
                    <Col md={4}><Button className="w-100 py-3" variant="outline-primary" onClick={() => navigate("/doctor/appointments")}>Add Prescription / Check Schedule</Button></Col>
                    <Col md={4}><Button className="w-100 py-3" variant="outline-secondary" onClick={() => navigate("/doctor/reports")}>View Patient History</Button></Col>
                    {/* Removed redundant/undefined buttons */}
                </Row>
            </Card>

        </div>
    );
}
