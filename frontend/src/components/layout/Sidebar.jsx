import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";

export default function Sidebar({ collapsed, toggleCollapse }) {
    const { user, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("darkMode") === "true"
    );

    // APPLY THEME
    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // ROLE-BASED MENUS
    const menus = {
        ROLE_PATIENT: [
            { to: "/patient/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
            { to: "/patient/appointments", label: "My Appointments", icon: "bi-calendar-event" },
            // { to: "/patient/payments", label: "Payments", icon: "bi-wallet2" },
            //{ to: "/patient/records", label: "Medical Records", icon: "bi-file-earmark-medical" },
            { to: "/patient/emergency", label: "Emergency Contacts", icon: "bi-telephone" },
            { to: "/patient/settings", label: "Settings", icon: "bi-gear" },
        ],

        ROLE_DOCTOR: [
            { to: "/doctor/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
            { to: "/doctor/reports", label: "Patient Reports", icon: "bi-file-medical" },
            { to: "/doctor/schedule", label: "Doctor Schedule", icon: "bi-calendar-week" },
            { to: "/doctor/prescriptions", label: "Appointments & Prescriptions", icon: "bi-capsule" },
            { to: "/doctor/settings", label: "Settings", icon: "bi-gear" },
        ],


        ROLE_ADMIN: [
            { to: "/admin/dashboard", label: "Dashboard", icon: "bi-speedometer" },
            { to: "/admin/staff/registration", label: "Staff Registration", icon: "bi-person-plus" },
            { to: "/admin/staff/directory", label: "Staff Directory", icon: "bi-people" },

            { to: "/admin/doctors", label: "Doctors", icon: "bi-person-badge" },
            { to: "/admin/nurses", label: "Nurses", icon: "bi-heart-pulse" },
            { to: "/admin/appointments", label: "All Appointments", icon: "bi-calendar-event" },
            { to: "/admin/records", label: "Medical Records", icon: "bi-file-earmark-medical" },
            { to: "/admin/settings", label: "Settings", icon: "bi-gear" },
        ],
    };

    const activeMenu = menus[user.role];

    // PROFILE DROPDOWN
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <div
            className="d-flex flex-column shadow-sm"
            style={{
                width: collapsed ? "70px" : "230px",
                minHeight: "100vh",
                background: "var(--sidebar-bg)",
                borderRight: "1px solid #e5e5e5",
                transition: "width 0.3s ease",
                position: "sticky",
                top: 0,
                padding: "15px",
            }}
        >

            {/* HEADER */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                {!collapsed && (
                    <h5 className="fw-bold m-0">
                        <i className="bi bi-heart-pulse me-2"></i> MedCare HMS
                    </h5>
                )}

                <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={toggleCollapse}
                    style={{ marginLeft: collapsed ? "-5px" : "0px" }}
                >
                    <i className={`bi ${collapsed ? "bi-list" : "bi-x-lg"}`}></i>
                </button>
            </div>

            {/* USER + PROFILE DROPDOWN */}
            <div className="text-center mb-4">
                <div
                    className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center mx-auto"
                    style={{
                        width: collapsed ? "45px" : "65px",
                        height: collapsed ? "45px" : "65px",
                        fontSize: collapsed ? "1rem" : "1.7rem",
                        transition: "all 0.3s",
                        cursor: "pointer",
                    }}
                    onClick={() => setShowProfileMenu(prev => !prev)}
                >
                    {user?.name?.charAt(0)}
                </div>

                {/* Show name + role ONLY when expanded */}
                {!collapsed && (
                    <>
                        <p className="fw-bold mt-2 mb-0">{user?.name}</p>
                        <p className="text-muted small">{user?.role}</p>
                    </>
                )}

                {/* PROFILE MENU */}
                {showProfileMenu && !collapsed && (
                    <div className="card p-2 shadow dropdown-menu show mt-2">
                        <button className="dropdown-item">My Profile</button>
                        <button className="dropdown-item">Settings</button>
                        <button className="dropdown-item" onClick={() => logout()}>Logout</button>
                    </div>
                )}
            </div>

            {/* NAVIGATION */}
            <ul className="nav flex-column gap-1">
                {activeMenu.map((item) => (
                    <SidebarLink
                        key={item.to}
                        collapsed={collapsed}
                        {...item}
                    />
                ))}
            </ul>

            <div className="flex-grow-1"></div>

            {/* DARK MODE TOGGLE */}
            <button
                className="btn btn-outline-secondary mt-3 d-flex align-items-center gap-2"
                onClick={() => setDarkMode(prev => !prev)}
            >
                <i className={`bi ${darkMode ? "bi-brightness-high" : "bi-moon"}`}></i>
                {!collapsed && <span>Dark Mode</span>}
            </button>

            {/* LOGOUT */}
            <button
                className="btn btn-outline-danger mt-3 d-flex align-items-center gap-2"
                onClick={() => { logout(); window.location.href = "/login"; }}
            >
                <i className="bi bi-box-arrow-right"></i>
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
    );
}

function SidebarLink({ to, icon, label, collapsed }) {
    return (
        <li>
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 ${isActive ? "active-link" : ""}`
                }
                data-bs-toggle={collapsed ? "tooltip" : ""}
                title={collapsed ? label : ""}
            >
                <i className={`bi ${icon} fs-5`}></i>
                {!collapsed && <span>{label}</span>}
            </NavLink>
        </li>
    );
}
