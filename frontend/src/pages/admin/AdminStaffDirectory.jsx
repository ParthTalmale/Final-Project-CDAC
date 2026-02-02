import React, { useState, useEffect } from "react";
import "./adminStaff.css";
import { getAllStaff } from "../../services/adminsApi";

export default function StaffDirectory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Data from Backend
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await getAllStaff();
                // Map backend DTO to frontend structure if needed, or use directly
                // Backend: { id, name, email, userRole }
                // Frontend expected: { id, name, email, role } (we need to map userRole -> role)
                const mappedData = data.map(u => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: formatRole(u.userRole) // Helper to clean up "ROLE_DOCTOR" -> "Doctor"
                }));
                setStaff(mappedData);
            } catch (err) {
                setError("Failed to load staff directory.");
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    const formatRole = (roleString) => {
        if (!roleString) return "Staff";
        // ROLE_DOCTOR -> Doctor
        return roleString.replace("ROLE_", "").charAt(0).toUpperCase() + roleString.replace("ROLE_", "").slice(1).toLowerCase();
    };

    // FILTERED RESULTS
    const filteredStaff = staff.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());

        // Frontend role is now "Doctor", "Nurse", "Admin" (from formatRole)
        // Filter values are "Doctor", "Nurse", "Administrator" (Note: "Administrator" vs "Admin" check)
        const matchesRole = roleFilter === "ALL" ||
            member.role === roleFilter ||
            (roleFilter === "Administrator" && member.role === "Admin");

        return matchesSearch && matchesRole;
    });

    if (loading) return <div className="p-4 text-center">Loading staff directory...</div>;
    if (error) return <div className="p-4 text-center text-danger">{error}</div>;

    return (
        <div className="staff-directory card p-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                    <i className="bi bi-people me-2"></i> Staff Directory
                </h5>
            </div>

            {/* SEARCH + FILTER */}
            <div className="row mb-4">
                <div className="col-md-6 mb-2">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="col-md-6 mb-2">
                    <select
                        className="form-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="ALL">All Roles</option>
                        <option value="Doctor">Doctors</option>
                        <option value="Nurse">Nurses</option>
                        <option value="Administrator">Administrators</option>
                    </select>
                </div>
            </div>

            {/* STAFF TABLE */}
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredStaff.map((member) => (
                        <tr key={member.id}>
                            <td className="fw-semibold">{member.name}</td>

                            {/* ROLE BADGE */}
                            <td>
                                <span className={`role-badge ${member.role.toLowerCase()}`}>
                                    {member.role}
                                </span>
                            </td>

                            <td className="text-muted">{member.email}</td>

                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-2">
                                    <i className="bi bi-pencil-square"></i> Edit
                                </button>

                                <button className="btn btn-sm btn-outline-danger">
                                    <i className="bi bi-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {filteredStaff.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center py-4 text-muted">
                                No staff found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
}
