import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function PatientLayout() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => setCollapsed(prev => !prev);

    // Auto collapse on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 992) setCollapsed(true);
            else setCollapsed(false);
        };

        handleResize(); // initial call
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="d-flex">
            <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} />

            <main
                className="flex-grow-1 p-4"
                style={{
                    background: "var(--bg-color)",
                    minHeight: "100vh",
                    transition: "margin-left 0.3s",
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}
