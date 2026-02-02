import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/adminsApi";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading Dashboard...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;

    return (
        <div className="admin-dashboard-container">

            {/* Page Header */}
            <div className="mb-4">
                <h2 className="fw-bold">Admin Dashboard</h2>
                <p className="text-muted">
                    Manage hospital staff, departments, and system overview
                </p>
            </div>

            {/* TOP CARDS (Dynamic) */}
            <div className="row g-4 mb-4">

                {/* Doctors */}
                <div className="col-md-6">
                    <div className="card admin-stat-card p-4 border-0 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <p className="text-muted mb-0 fw-semibold">Total Doctors</p>
                            <i className="bi bi-person-check fs-2 text-success"></i>
                        </div>
                        <div className="d-flex align-items-baseline">
                            <h2 className="fw-bold me-2 mb-0">{stats.totalDoctors}</h2>
                            <span className="text-success small">Active</span>
                        </div>
                    </div>
                </div>

                {/* Nurses */}
                <div className="col-md-6">
                    <div className="card admin-stat-card p-4 border-0 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <p className="text-muted mb-0 fw-semibold">Total Nurses</p>
                            <i className="bi bi-heart fs-2 text-danger"></i>
                        </div>
                        <div className="d-flex align-items-baseline">
                            <h2 className="fw-bold me-2 mb-0">{stats.totalNurses}</h2>
                            <span className="text-success small">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* STAFF MANAGEMENT SECTION */}
            <div className="card p-4 mb-4 border-0 shadow-sm">
                <div className="d-flex justify-content-between mb-3">
                    <h5 className="fw-bold">
                        <i className="bi bi-gear me-2"></i>Staff Management
                    </h5>
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <button className="btn btn-light w-100 py-3" onClick={() => navigate("/admin/staff/registration")} >
                            ➕ Add Doctor
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-light w-100 py-3" onClick={() => navigate("/admin/doctors")}>
                            ➖ Remove/Manage Doctor
                        </button>
                    </div>

                    <div className="col-md-6">
                        <button className="btn btn-light w-100 py-3" onClick={() => navigate("/admin/staff/registration")}>
                            ➕ Add Nurse
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-light w-100 py-3" onClick={() => navigate("/admin/nurses")}>
                            ➖ Remove/Manage Nurse
                        </button>
                    </div>
                </div>
            </div>

            {/* RECENT STAFF CHANGES (Top 4) */}
            <div className="card p-4 mb-4 border-0 shadow-sm">
                <h5 className="fw-bold mb-3">Recent Staff Changes</h5>

                <div className="list-group list-group-flush">
                    {stats.recentStaff && stats.recentStaff.length > 0 ? (
                        stats.recentStaff.map((staff, index) => (
                            <div className="list-group-item d-flex justify-content-between px-0" key={index}>
                                <div>
                                    <span className="badge bg-success me-2">{staff.action}</span>
                                    <span className="fw-semibold">{staff.name}</span>
                                    <span className="text-muted small ms-2">({staff.role})</span>
                                </div>
                                <span className="text-muted small">{staff.joinDate}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center m-0">No recent changes.</p>
                    )}
                </div>
            </div>

            {/* DEPARTMENT OVERVIEW */}
            <div className="card p-4 mb-4 border-0 shadow-sm">
                <div className="d-flex justify-content-between mb-3">
                    <h5 className="fw-bold">Department Overview</h5>
                </div>

                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Department</th>
                                <th className="text-center">Doctors</th>
                                <th className="text-center">Nurses</th>
                                <th className="text-center">Total Staff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.departmentStats && stats.departmentStats.map((dept, index) => (
                                <tr key={index}>
                                    <td className="fw-semibold">{dept.deptName}</td>
                                    <td className="text-center">{dept.doctorCount}</td>
                                    <td className="text-center">{dept.nurseCount}</td>
                                    <td className="text-center fw-bold">{dept.totalStaff}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* LOWER QUICK LINKS SECTION */}
            <div className="row g-4">
                {/* System Management */}
                <div className="col-md-6">
                    <div className="card p-4 border-0 shadow-sm h-100">
                        <h5 className="fw-bold mb-3">System Management</h5>
                        <button className="btn btn-light w-100 mb-2">System Settings</button>
                        <button className="btn btn-light w-100 mb-2">Backup Data</button>
                    </div>
                </div>

                {/* Reports */}
                <div className="col-md-6">
                    <div className="card p-4 border-0 shadow-sm h-100">
                        <h5 className="fw-bold mb-3">Reports</h5>
                        <button className="btn btn-light w-100 mb-2">Staff Performance</button>
                        <button className="btn btn-light w-100 mb-2">Financial Reports</button>
                    </div>
                </div>
            </div>

        </div>
    );
}


