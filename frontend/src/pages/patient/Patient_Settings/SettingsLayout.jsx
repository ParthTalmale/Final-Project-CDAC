import { NavLink, Outlet } from "react-router-dom";

export default function SettingsLayout() {
    const tabs = ["edit-profile", "notification", "appearance"];

    return (
        <div className="w-100 p-3">

            {/* Header */}
            <div className="mb-3">
                <h3 className="mb-1">Settings</h3>
                <p className="text-muted">Manage your settings</p>
            </div>

            {/* Pill Tabs */}
            <div className="pill-tabs mb-4">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab}
                        to={tab}
                        className={({ isActive }) =>
                            "pill-tab" + (isActive ? " pill-active" : "")
                        }
                    >
                        {/* {tab.charAt(0).toUpperCase() + tab.slice(1)} */}
                        {tab.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </NavLink>
                ))}
            </div>

            {/* Page Content */}
            <Outlet />
        </div>
    );
}
