import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Button,
    Form,
    InputGroup,
} from "react-bootstrap";
import {
    FaSearch,
    FaCalendarAlt,
    FaUserMd,
} from "react-icons/fa";

export default function MedicalRecords() {
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 2;


    const [medicalRecords, setMedicalRecords] = useState([]);
    const [lastVisitDate, setLastVisitDate] = useState(null);
    const [labReportsCount, setLabReportsCount] = useState(0);
    const [activePrescriptionsCount, setActivePrescriptionsCount] = useState(0);

    const fetchLabReportsCount = async () => {
        // Fetch lab reports count from API
        const data = await fetchLabReportsCount();
        if (data) {
            setLabReportsCount(data);
        }
    }

    const fetchActivePrescriptionCount = async () => {
        const data = await fetchActivePrescriptionCount();
        if (data) {
            setActivePrescriptionsCount(data);
        }
    }

    const fetchLastVisitDate = async () => {
        // Fetch last visit date from API
        const data = await fetchLastVisitDate();
        if (data) {
            setLastVisitDate(data);
        }
    }
    const fetchMedicalRecords = async () => {
        // Fetch medical records from API
        const data = await fetchMedicalRecords();
        if (data) {
            setMedicalRecords(data);
        }
    }

    useEffect(() => {
        fetchMedicalRecords();
        fetchLastVisitDate();
        fetchLabReportsCount();
        fetchActivePrescriptionCount();
    }, []);

    const records = [
        {
            title: "Regular Checkup",
            date: "22/01/2024",
            doctor: "Dr. Smith",
            type: "consultation",
            status: "completed",
            desc: "Annual physical examination and health assessment",

            diagnosis: "Hypertension, Stage 1",
            treatment: "Lifestyle modifications, medication management",
            vitals: {
                bp: "140/90",
                hr: "78",
                temp: "98.6°F",
                weight: "180 lbs",
            },
            medication: {
                name: "Lisinopril - 10mg",
                dose: "Once daily for 30 days",
                note: "Take with food",
            },
            notes: "Patient reports feeling well. Blood pressure slightly elevated.",
            followup: "Return in 3 months for follow-up",
            icon: "🩺",
        },
        {
            title: "Blood Pressure Medication",
            date: "18/01/2024",
            doctor: "Dr. Smith",
            type: "prescription",
            status: "active",
            desc: "Prescription for hypertension management",

            diagnosis: "Hypertension control",
            treatment: "Long-term medication",
            vitals: {
                bp: "135/88",
                hr: "80",
                temp: "98.8°F",
                weight: "179 lbs",
            },
            medication: {
                name: "Amlodipine - 5mg",
                dose: "Once daily",
                note: "Take in the morning",
            },
            notes: "Medication tolerated well.",
            followup: "Monitor BP every week",
            icon: "💊",
        },
        {
            title: "Lab Test Results",
            date: "10/01/2024",
            doctor: "Dr. Adams",
            type: "lab",
            status: "completed",
            desc: "Blood test and cholesterol report",
            diagnosis: "Mild cholesterol elevation",
            treatment: "Diet changes",
            vitals: {
                bp: "130/85",
                hr: "76",
                temp: "98.4°F",
                weight: "178 lbs",
            },
            medication: {
                name: "No medication",
                dose: "-",
                note: "-",
            },
            notes: "LDL slightly high.",
            followup: "Repeat test in 6 months",
            icon: "🧪",
        },
    ];

    const totalPages = Math.ceil(records.length / recordsPerPage);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentRecords = records.slice(firstIndex, lastIndex);
    return (
        <Container fluid className="p-4">
            <h3>Medical Records</h3>
            <p className="text-muted">
                View your complete medical history, reports, and health information
            </p>

            {/* TOP STATS */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="p-3 shadow-sm border-0">
                        <strong>Total Records</strong>
                        <h4 className="mt-2">2</h4>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="p-3 shadow-sm border-0">
                        <strong>Active Prescriptions</strong>
                        <h4 className="mt-2">1</h4>
                    </Card>
                </Col>
                {/*
                <Col md={3}>
                    <Card className="p-3 shadow-sm border-0">
                        <strong>Lab Reports</strong>
                        <h4 className="mt-2">0</h4>
                    </Card>
                </Col>
                */}

                <Col md={3}>
                    <Card className="p-3 shadow-sm border-0">
                        <strong>Last Visit</strong>
                        <h4 className="mt-2 text-danger">22/01/2024</h4>
                    </Card>
                </Col>
            </Row>

            {/* Search Filters */}
            <Row className="mb-4">
                <Col sm={8}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control placeholder="Search your records by title or doctor..." />
                    </InputGroup>
                </Col>
                <Col sm={2}>
                    <Form.Select>
                        <option>All Types</option>
                    </Form.Select>
                </Col>
                <Col sm={2}>
                    <Button variant="outline-secondary">More Filters</Button>
                </Col>
            </Row>

            {/* list + detail */}
            <Row>
                {/* LEFT LIST */}
                <Col md={8}>
                    {currentRecords.map((r, index) => (
                        <Card
                            key={index}
                            className="p-3 mb-3 shadow-sm border-0"
                            onClick={() => setSelectedRecord(r)}
                            style={{ cursor: "pointer" }}
                        >
                            <Row>
                                <Col xs={1} className="fs-2">
                                    {r.icon}
                                </Col>
                                <Col>
                                    <h5>{r.title}</h5>

                                    <div className="text-muted small mb-2">
                                        <FaCalendarAlt /> {r.date} &nbsp;&nbsp;
                                        <FaUserMd /> {r.doctor}
                                    </div>

                                    <p className="text-muted">{r.desc}</p>

                                    <Badge bg="light" text="dark" className="me-2">
                                        {r.type}
                                    </Badge>
                                    <Badge bg="dark">{r.status}</Badge>
                                </Col>
                            </Row>
                        </Card>
                    ))}

                    <div className='d-flex justify-content-center align-items-center mt-4'>
                        <Button
                            variant="outline-secondary"
                            className="me-2"
                            disabled={currentPage == 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            Prev
                        </Button>
                        {[...Array(totalPages)].map((_, idx) => {
                            <Button
                                key={idx}
                                className="me-2"
                                variant={currentPage === idx + 1 ? 'dark' : 'outline-dark'}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </Button>

                        })}

                        <Button
                            variant="outline-secondary"
                            disabled={currentPage == totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >Next</Button>

                    </div>
                </Col>

                {/* RIGHT DETAILS */}
                <Col md={4}>
                    {!selectedRecord && (
                        <Card className="p-5 text-center shadow-sm border-0">
                            <div className="fs-1 mb-3">📄</div>
                            <h5>Select a Record</h5>
                            <p className="text-muted">
                                Click on a medical record to view detailed information.
                            </p>
                        </Card>
                    )}

                    {selectedRecord && (
                        <Card className="p-4 shadow-sm border-0">
                            <h4>{selectedRecord.title}</h4>
                            <p>{selectedRecord.desc}</p>

                            <h6>Diagnosis</h6>
                            <p>{selectedRecord.diagnosis}</p>

                            <h6>Treatment</h6>
                            <p>{selectedRecord.treatment}</p>

                            <h6>Vital Signs</h6>
                            <p>
                                BP: {selectedRecord.vitals.bp} &nbsp;&nbsp;
                                HR: {selectedRecord.vitals.hr}
                                <br />
                                Temp: {selectedRecord.vitals.temp} &nbsp;&nbsp;
                                Weight: {selectedRecord.vitals.weight}
                            </p>

                            <h6>Medications</h6>
                            <Card className="p-3 bg-light mb-3">
                                <strong>{selectedRecord.medication.name}</strong>
                                <div className="text-muted">
                                    {selectedRecord.medication.dose}
                                </div>
                                <em>{selectedRecord.medication.note}</em>
                            </Card>

                            <h6>Notes</h6>
                            <p>{selectedRecord.notes}</p>

                            <h6>Follow-up</h6>
                            <p>{selectedRecord.followup}</p>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}