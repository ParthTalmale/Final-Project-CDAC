import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AdminLayout from './../components/layout/AdminLayout';



export default function AdminRoute() {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "ADMIN" && user.role !== "ROLE_ADMIN") return <Navigate to="/login" replace />;

    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
}
