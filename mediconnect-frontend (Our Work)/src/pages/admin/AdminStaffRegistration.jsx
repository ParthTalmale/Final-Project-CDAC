import React, { useState } from "react";
import "./adminStaff.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminStaffRegistration() {
    const [activeTab, setActiveTab] = useState("register");
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <div className="admin-staff-container">

            {/* PAGE TITLE */}
            <h3 className="fw-bold mb-2">Staff Management</h3>
            <p className="text-muted">
                Register new healthcare staff members and manage existing accounts
            </p>

            {/* TAB SWITCHER */}
            <div className="tabs-wrapper d-flex justify-content-between my-4">
                <button
                    className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("register");
                        navigate("/admin/staff/registration");
                    }}
                >
                    <i className="bi bi-person-plus me-2"></i>
                    Register Staff
                </button>

                <button
                    className={`tab-btn ${activeTab === "directory" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("directory");
                        navigate("/admin/staff/directory");
                    }}
                >
                    <i className="bi bi-people me-2"></i>
                    Staff Directory
                </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "register" ? (
                <RegisterStaffForm />
            ) : (
                <StaffDirectory />
            )}

        </div>
    );
}

// ============================
// STAFF REGISTRATION FORM
// ============================
// ============================
// STAFF REGISTRATION FORM
// ============================
import { registerStaff } from "../../services/adminsApi";
import { getAllDepartments } from "../../services/departmentsApi";

// ... imports
import { toast } from "react-toastify";

function RegisterStaffForm() {
    const [form, setForm] = useState({
        roleParam: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        dob: "",
        address: "",
        // Doctor/Nurse specific
        departmentId: "",
        specialization: "",
        licenseNumber: "",
        yearsOfExperience: "",
        shift: "",
        qualification: "",
        notes: ""
    });

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Departments on mount
    React.useEffect(() => {
        getAllDepartments()
            .then(data => setDepartments(data))
            .catch(err => console.error("Failed to load departments", err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (!form.roleParam || form.roleParam === "Select role") {
            toast.warning("Please select a valid role.");
            return;
        }

        let backendRole = "";
        if (form.roleParam === "Doctor") backendRole = "ROLE_DOCTOR";
        if (form.roleParam === "Nurse") backendRole = "ROLE_NURSE";
        if (form.roleParam === "Administrator") backendRole = "ROLE_ADMIN";

        // Construct Payload
        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            dob: form.dob,
            userRole: backendRole,
            // Common optional
            address: form.address,

            // Staff Specific
            departmentId: (form.roleParam === "Doctor" || form.roleParam === "Nurse") ? form.departmentId : null,

            // Doctor Specific
            specialization: form.roleParam === "Doctor" ? form.specialization : null,
            licenseNumber: form.roleParam === "Doctor" ? form.licenseNumber : null,
            yearsOfExperience: form.roleParam === "Doctor" ? form.yearsOfExperience : 0,

            // Nurse Specific
            shift: form.roleParam === "Nurse" ? form.shift : null,
            qualification: form.roleParam === "Nurse" ? form.qualification : null,
        };

        setLoading(true);
        try {
            await registerStaff(payload);
            toast.success("Staff Registered Successfully!"); // Toast success
            setForm({
                roleParam: "",
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                dob: "",
                address: "",
                departmentId: "",
                specialization: "",
                licenseNumber: "",
                yearsOfExperience: "",
                shift: "",
                qualification: "",
                notes: ""
            });
        } catch (err) {
            toast.error("Error: " + (err.message || "Registration Failed")); // Toast error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4">
            <h5 className="fw-bold mb-4">
                <i className="bi bi-person-plus me-2"></i>
                Register New Staff Member
            </h5>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Role */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Role *</label>
                        <select
                            className="form-select"
                            name="roleParam"
                            value={form.roleParam}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select role</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Administrator">Administrator</option>
                        </select>
                    </div>

                    {/* Department Dropdown (Only for Doctor & Nurse) */}
                    {(form.roleParam === "Doctor" || form.roleParam === "Nurse") && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Department *</label>
                            <select
                                className="form-select"
                                name="departmentId"
                                value={form.departmentId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.deptName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name *</label>
                        <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    {/* Email */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email Address *</label>
                        <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                    </div>

                    {/* Phone */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Phone Number *</label>
                        <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
                    </div>

                    {/* Passwords */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Temporary Password *</label>
                        <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Confirm Password *</label>
                        <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                    </div>

                    {/* DOB */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Date of Birth *</label>
                        <input type="date" className="form-control" name="dob" value={form.dob} onChange={handleChange} required />
                    </div>

                    {/* Address */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} />
                    </div>

                    {/* === DOCTOR SPECIFIC FIELDS === */}
                    {form.roleParam === "Doctor" && (
                        <>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Specialization *</label>
                                <input type="text" className="form-control" name="specialization" value={form.specialization} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">License Number *</label>
                                <input type="text" className="form-control" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Years of Experience</label>
                                <input type="number" className="form-control" name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange} />
                            </div>
                        </>
                    )}

                    {/* === NURSE SPECIFIC FIELDS === */}
                    {form.roleParam === "Nurse" && (
                        <>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Shift *</label>
                                <select className="form-select" name="shift" value={form.shift} onChange={handleChange} required>
                                    <option value="">Select Shift</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Night">Night</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Qualification *</label>
                                <input type="text" className="form-control" name="qualification" value={form.qualification} onChange={handleChange} required />
                            </div>
                        </>
                    )}
                </div>

                {/* BUTTONS */}
                <div className="d-flex justify-content-end gap-3 mt-3">
                    <button type="reset" className="btn btn-outline-secondary px-4" onClick={() => setForm({ roleParam: "", name: "", email: "", phone: "", password: "", confirmPassword: "", dob: "", address: "", notes: "", departmentId: "", specialization: "", licenseNumber: "", yearsOfExperience: "", shift: "", qualification: "" })}>
                        Clear Form
                    </button>

                    <button type="submit" className="btn btn-dark px-4" disabled={loading}>
                        {loading ? "Creating..." : "Create Staff Account"}
                    </button>
                </div>

            </form>
        </div>
    );
}

// ============================
// STAFF DIRECTORY TAB (placeholder)
// ============================
function StaffDirectory() {
    return (
        <div className="card p-4 text-center">
            <h5 className="fw-bold mb-2">Staff Directory</h5>
            <p className="text-muted">Staff listing will appear here.</p>
        </div>
    );
}
