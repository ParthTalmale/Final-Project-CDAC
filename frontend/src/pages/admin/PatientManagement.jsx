import React from "react";
import {
  Button,
  Card,
  Form,
  Table,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { Plus, Search, Eye, Pencil } from "react-bootstrap-icons";

const PatientManagement = () => {
  const patients = [
    {
      id: "P001",
      name: "John Doe",
      blood: "O+",
      age: 45,
      gender: "Male",
      doctor: "Dr. Smith",
      room: "101A",
      status: "active",
    },
    {
      id: "P002",
      name: "Sarah Wilson",
      blood: "A+",
      age: 32,
      gender: "Female",
      doctor: "Dr. Johnson",
      room: "ICU-03",
      status: "critical",
    },
    {
      id: "P003",
      name: "Robert Brown",
      blood: "B-",
      age: 67,
      gender: "Male",
      doctor: "Dr. Davis",
      room: "N/A",
      status: "discharged",
    },
  ];

  const statusColor = (s) => {
    return {
      active: "success",
      critical: "danger",
      discharged: "secondary",
    }[s];
  };

  return (
    <div
      className="p-4"
      style={{ backgroundColor: "#F5F7FB", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ letterSpacing: "-.5px" }}>
            Patient Management
          </h2>
          <div className="text-muted" style={{ fontSize: "14px" }}>
            Manage patient details, real-time condition & hospitalization status
          </div>
        </div>

        <Button
          variant="dark"
          style={{
            borderRadius: "50px",
            padding: "10px 22px",
            fontWeight: "600",
          }}
        >
          <Plus size={18} className="me-2" />
          Add Patient
        </Button>
      </div>

      {/* Search */}
      <Card
        className="shadow-sm border-0 mb-4"
        style={{
          borderRadius: "18px",
          padding: "18px",
          background: "rgba(255,255,255,.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="d-flex gap-3">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              style={{
                borderRadius: "12px",
              }}
              placeholder="Search by name or ID…"
            />
          </InputGroup>

          <Form.Select style={{ maxWidth: "200px", borderRadius: "12px" }}>
            <option>Status</option>
            <option>Active</option>
            <option>Critical</option>
            <option>Discharged</option>
          </Form.Select>
        </div>
      </Card>

      {/* Table */}
      <Card
        className="shadow-sm border-0"
        style={{
          borderRadius: "18px",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Table hover responsive className="mb-0">
          <thead
            style={{
              background: "#F2F4F8",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Doctor</th>
              <th>Room</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                style={{
                  height: "65px",
                  verticalAlign: "middle",
                }}
              >
                <td className="fw-semibold">{p.id}</td>

                <td>
                  <span className="fw-semibold">{p.name}</span>
                  <div className="text-muted" style={{ fontSize: "12px" }}>
                    {p.blood}
                  </div>
                </td>

                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.doctor}</td>
                <td>{p.room}</td>

                <td>
                  <Badge
                    bg={statusColor(p.status)}
                    pill
                    style={{ fontSize: "13px" }}
                  >
                    {p.status}
                  </Badge>
                </td>

                <td className="text-end">
                  <Button
                    size="sm"
                    variant="light"
                    className="me-2"
                    style={{ borderRadius: "50px" }}
                  >
                    <Eye />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-dark"
                    style={{ borderRadius: "50px" }}
                  >
                    <Pencil />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default PatientManagement;
