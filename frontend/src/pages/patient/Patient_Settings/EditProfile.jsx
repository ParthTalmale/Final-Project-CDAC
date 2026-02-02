import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";

export default function EditProfile() {
    const [formData, setFormData] = useState({
        fullName: "Sarah Johnson",
        email: "sarah@example.com",
        address: "",
        phone: "",
        password: "",
        confirmPassword: "",
        dob: "1999-01-01"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Card className="p-4 shadow-sm mb-4">
                <h5 className="mb-4">👤 Profile Information</h5>

                {/* Full Name */}
                <div className="border-bottom pb-3 mb-3">
                    <div className="fw-semibold">Full Name</div>
                    <Form.Control
                        className="mt-2"
                        value={formData.fullName}
                        readOnly
                    />
                </div>

                {/* Email */}
                <div className="border-bottom pb-3 mb-3">
                    <div className="fw-semibold">Email</div>
                    <Form.Control
                        className="mt-2"
                        value={formData.email}
                        readOnly
                    />
                </div>

                {/* Address */}
                <div className="border-bottom pb-3 mb-3">
                    <div className="fw-semibold">Address</div>
                    <Form.Control
                        className="mt-2"
                        as="textarea"
                        rows={3}
                        name="address"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                {/* Phone */}
                <div>
                    <div className="fw-semibold">Phone Number</div>
                    <Form.Control
                        className="mt-2"
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
            </Card>

            {/* Password Card */}
            <Card className="p-4 shadow-sm">
                <h5 className="mb-4">🔒 Security</h5>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label className="fw-semibold">New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="New password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Col>

                    <Col md={6}>
                        <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Save Button */}
            <div className="text-end mt-4">
                <Button className="px-4" variant="dark">
                    💾 Save Settings
                </Button>
            </div>

            {/* Hidden DOB */}
            <input type="hidden" value={formData.dob} />
        </>
    );
}
