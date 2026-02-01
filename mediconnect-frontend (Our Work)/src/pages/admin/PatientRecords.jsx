import React, { useState, useMemo } from "react";
import { Modal, Button, Form, Badge, Row, Col } from "react-bootstrap";
import "./PatientRecords.css"

const initialRecords = [
  {
    id: 1,
    type: "consultation",
    title: "Regular Checkup",
    patient: "John Doe",
    doctor: "Dr. Smith",
    date: "2024-01-22",
    time: "14:00",
    description: "Annual physical examination and health assessment",
    status: "completed",
    medications: []
  },
  {
    id: 2,
    type: "lab result",
    title: "Blood Work Results",
    patient: "Sarah Wilson",
    doctor: "Dr. Johnson",
    date: "2024-01-20",
    time: "08:30",
    description: "Complete blood count and metabolic panel",
    status: "completed",
    medications: []
  },
  {
    id: 3,
    type: "prescription",
    title: "Blood Pressure Medication",
    patient: "John Doe",
    doctor: "Dr. Smith",
    date: "2024-01-18",
    time: "10:00",
    description: "Prescription for hypertension management",
    status: "active",
    medications: [
      { name: "Amlodipine - 5mg", note: "Once daily for 90 days" }
    ]
  }
];

export default function PatientRecords1() {
  const [records, setRecords] = useState(initialRecords);
  const [selected, setSelected] = useState(initialRecords[0]);

  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPatient, setFilterPatient] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    patient: "",
    doctor: "",
    date: "",
    time: "",
    type: "consultation",
    description: "",
    medications: ""
  });

  const patients = ["All", ...new Set(records.map(r => r.patient))];

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.patient.toLowerCase().includes(search.toLowerCase()) ||
        r.doctor.toLowerCase().includes(search.toLowerCase());

      const matchPatient =
        filterPatient === "All" || r.patient === filterPatient;
      const matchType = filterType === "All" || r.type === filterType;

      return matchSearch && matchPatient && matchType;
    });
  }, [records, search, filterPatient, filterType]);

  const handleAddRecord = () => {
    const newRecord = {
      ...formData,
      id: records.length + 1,
      status: "active",
      medications:
        formData.type === "prescription"
          ? [{ name: formData.medications, note: "" }]
          : []
    };

    setRecords([newRecord, ...records]);
    setShow(false);
  };

  const badgeColor = (type) => {
    if (type === "consultation") return "primary";
    if (type === "lab result") return "success";
    if (type === "prescription") return "warning";
    return "secondary";
  };

  const statusColor = (status) => {
    return status === "completed" ? "secondary" : "dark";
  };

  return (
    <div className="container-lg py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold">Medical Records</h3>
          <p className="text-muted">
            View and manage patient medical records and history
          </p>
        </div>
        <Button className="btn-dark" onClick={() => setShow(true)}>
          + Add Record
        </Button>
      </div>

      {/* Filters */}
      <div className="card p-3 mb-4 border-0 shadow-sm rounded-4">
        <Row className="g-2">
          <Col md={6}>
            <Form.Control
              placeholder="Search records by patient, title, or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterPatient}
              onChange={(e) => setFilterPatient(e.target.value)}
            >
              {patients.map((p, i) => (
                <option key={i}>{p}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="lab result">Lab Result</option>
              <option value="prescription">Prescription</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Grid Layout */}
      <Row className="g-4">
        {/* Left List */}
        <Col md={7}>
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className={`record-card-modern mb-3 ${
                selected?.id === record.id ? "active-card" : ""
              }`}
              onClick={() => setSelected(record)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-semibold mb-1">{record.title}</h6>
                  <small className="text-muted">{record.patient}</small>
                </div>

                <div className="d-flex gap-1">
                  <Badge bg={badgeColor(record.type)} className="rounded-pill">
                    {record.type}
                  </Badge>
                  <Badge bg={statusColor(record.status)} className="rounded-pill">
                    {record.status}
                  </Badge>
                </div>
              </div>

              <div className="text-muted small mt-2">
                {record.date} • {record.doctor}
              </div>

              <div className="mt-2 small">{record.description}</div>
            </div>
          ))}
        </Col>

        {/* Right Details */}
        <Col md={5}>
          {selected && (
            <div className="details-card-modern">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Record Details</h6>
                <Button size="sm" variant="outline-secondary">
                  Export
                </Button>
              </div>

              <div className="mb-2">
                <div className="text-muted small">Title</div>
                <div className="fw-medium">{selected.title}</div>
              </div>

              <Row>
                <Col>
                  <div className="text-muted small">Patient</div>
                  <div>{selected.patient}</div>
                </Col>
                <Col>
                  <div className="text-muted small">Doctor</div>
                  <div>{selected.doctor}</div>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col>
                  <div className="text-muted small">Date</div>
                  <div>{selected.date}</div>
                </Col>
                <Col>
                  <div className="text-muted small">Time</div>
                  <div>{selected.time}</div>
                </Col>
              </Row>

              <div className="mt-3">
                <div className="text-muted small">Description</div>
                <div>{selected.description}</div>
              </div>

              {selected.type === "prescription" && (
                <div className="mt-3">
                  <div className="text-muted small">Medications</div>
                  {selected.medications.map((m, i) => (
                    <div key={i} className="med-box">
                      <strong>{m.name}</strong>
                      <div className="small text-muted">{m.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Medical Record</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              placeholder="Title"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              placeholder="Patient"
              onChange={(e) =>
                setFormData({ ...formData, patient: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              placeholder="Doctor"
              onChange={(e) =>
                setFormData({ ...formData, doctor: e.target.value })
              }
            />
            <Form.Select
              className="mb-2"
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="consultation">Consultation</option>
              <option value="lab result">Lab Result</option>
              <option value="prescription">Prescription</option>
            </Form.Select>

            <Row>
              <Col>
                <Form.Control
                  type="date"
                  className="mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </Col>
              <Col>
                <Form.Control
                  type="time"
                  className="mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Description"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {formData.type === "prescription" && (
              <Form.Control
                className="mt-2"
                placeholder="Medication (e.g. Amlodipine - 5mg)"
                onChange={(e) =>
                  setFormData({ ...formData, medications: e.target.value })
                }
              />
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddRecord}>Save Record</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
