import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link, Links } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4">
        <a className="navbar-brand d-flex align-items-center fw-bold fs-4" href="#">
          <span className="text-primary me-2">❤️</span> MedCare HMS
        </a>

        <div className="ms-auto d-flex gap-3">
          <a href="#about" className="text-dark fw-bold me-4 text-decoration-none outline-dark align-self-center">About</a>
          {/* <button className="btn btn-outline-dark me-2"><Link to='/login' className="text-decoration-none link-light"> Login</Link></button> */}
          <button className="btn btn-dark"><Link to='/login' className="text-decoration-none text-white"> Login</Link></button>
          
          <button className="btn btn-dark "><Link className="text-decoration-none text-white" to='/register'> Get Started</Link></button>
        </div>
      </nav>


      <section
        className="text-center py-5"
        style={{ backgroundColor: "#f0f5ff", minHeight: "80vh" }}
      >
        <Container>
          <div className="d-inline-block px-4 py-2 bg-white rounded-pill shadow-sm mb-3">
            <span className="text-primary fw-semibold">
              ⚕️ Advanced Healthcare Management
            </span>
          </div>

          <h1 className="fw-bold display-4 mt-3">
            Complete Hospital Management{" "}
            <span className="text-primary">Made Simple</span>
          </h1>

          <p className="text-muted fs-5 mt-3 mx-auto" style={{ maxWidth: "650px" }}>
            Streamline your healthcare operations with our comprehensive hospital
            management system. Patients can register online, while healthcare staff
            accounts are managed by administrators.
          </p>

          <div className="mt-4">
            <Button variant="dark" size="lg" className="me-3">
              <Link
                to="/register"
                className="text-decoration-none text-white"
              >Register as Patient</Link>
            </Button>
            <Button variant="outline-dark" size="lg">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <Row className="text-center mt-5 pt-4">
            <Col>
              <h2 className="text-primary fw-bold">10,000+</h2>
              <p className="text-muted">Patients Served</p>
            </Col>

            <Col>
              <h2 className="text-primary fw-bold">500+</h2>
              <p className="text-muted">Healthcare Providers</p>
            </Col>

            <Col>
              <h2 className="text-primary fw-bold">99.9%</h2>
              <p className="text-muted">System Uptime</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Everything You Need Section */}
      <section className="py-5" id="about">
        <Container>
          <h2 className="text-center fw-bold display-6">Everything You Need in One Platform</h2>
          <p className="text-center text-muted fs-5 mx-auto" style={{ maxWidth: "800px" }}>
            Our integrated solution covers all aspects of hospital management, from
            patient care to administrative operations.
          </p>

          {/* Feature Cards - Row 1 */}
          <Row className="mt-5 g-4">
            <Col md={4}>
              <Card className="p-4 shadow-sm border-0 rounded-4">
                <div className="bg-light text-primary p-3 rounded-3 d-inline-block fs-4 mb-3">👥</div>
                <h5 className="fw-bold">Patient Portal</h5>
                <p className="text-muted">
                  Complete patient management with scheduling, history, and payments.
                </p>
                <ul className="text-muted">
                  <li>Online appointment booking</li>
                  <li>Medical history access</li>
                  <li>Secure payment processing</li>
                  <li>Prescription tracking</li>
                </ul>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-4 shadow-sm border-0 rounded-4">
                <div className="bg-light text-success p-3 rounded-3 d-inline-block fs-4 mb-3">📈</div>
                <h5 className="fw-bold">Doctor Dashboard</h5>
                <p className="text-muted">
                  Tools for healthcare providers to manage patients and workflows.
                </p>
                <ul className="text-muted">
                  <li>Patient report management</li>
                  <li>Prescription writing</li>
                  <li>Appointment oversight</li>
                  <li>Clinical documentation</li>
                </ul>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-4 shadow-sm border-0 rounded-4">
                <div className="bg-light text-purple p-3 rounded-3 d-inline-block fs-4 mb-3">🛡️</div>
                <h5 className="fw-bold">Admin Control</h5>
                <p className="text-muted">
                  Full administrative oversight with staff and system monitoring.
                </p>
                <ul className="text-muted">
                  <li>Staff management</li>
                  <li>System analytics</li>
                  <li>Revenue tracking</li>
                  <li>Department oversight</li>
                </ul>
              </Card>
            </Col>
          </Row>

          {/* Feature Cards - Row 2 */}
          <Row className="mt-4 g-4">
            <Col md={4}>
              <Card className="p-4 shadow-sm border-0 rounded-4">
                <div className="bg-light text-warning p-3 rounded-3 d-inline-block fs-4 mb-3">📅</div>
                <h5 className="fw-bold">Smart Scheduling</h5>
                <p className="text-muted">
                  Advanced scheduling with reminders and conflict resolution.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-4 shadow-sm border-0 rounded-4">
                <div className="bg-light text-danger p-3 rounded-3 d-inline-block fs-4 mb-3">📄</div>
                <h5 className="fw-bold">Medical Records</h5>
                <p className="text-muted">
                  Secure electronic health records with easy access and compliance.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-4 shadow-sm border-0 rounded-4">
                <div className="bg-light text-primary p-3 rounded-3 d-inline-block fs-4 mb-3">⏰</div>
                <h5 className="fw-bold">24/7 Support</h5>
                <p className="text-muted">
                  Round-the-clock technical support and system monitoring.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blue CTA Section */}
      <section className="text-center py-5" style={{ backgroundColor: "#0d6efd", color: "white" }}>
        <Container>
          <h2 className="fw-bold display-5">Ready to Transform Your Healthcare Operations?</h2>
          <p className="fs-5 mt-3 text-white">
            Join thousands of healthcare providers who trust MedCare HMS.
          </p>
          {/* <Button variant="light" size="lg" className="me-3">
          <Link to="/register">Register as Patient</Link>
          </Button>
          <Button variant="outline-light" size="lg">
            Learn More
          </Button> */}
          <Button size="lg" className="me-3">

            <Link to="/register" style={{ textDecoration: 'none' }} className="border rounded bg-light text-dark p-2">
              Register as Patient
            </Link>
          </Button>
          {/* <button className="btn btn-dark"><Link to='/login' className="text-decoration-none text-white"> Register As Patient</Link></button> */}


          <Button size="lg">

            <Link to="/learn-more" style={{ textDecoration: 'none' }} className="border rounded text-white p-2 outline-white ">
              Learn More
            </Link>
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center" style={{ background: "#0b1220", color: "#d0d6e1" }}>
        <Container>
          <h4 className="fw-bold text-light">
            ❤️ MedCare HMS
          </h4>
          <p className="mt-2">
            Comprehensive hospital management for the modern healthcare environment.
          </p>

          <div className="d-flex justify-content-center gap-4 mt-3">
            <a href="#" className="text-light text-decoration-none">About Us</a>
            <a href="#" className="text-light text-decoration-none">Privacy Policy</a>
            <a href="#" className="text-light text-decoration-none">Terms of Service</a>
            <a href="#" className="text-light text-decoration-none">Contact</a>
          </div>
        </Container>
      </footer>
    </div>
  );
}

