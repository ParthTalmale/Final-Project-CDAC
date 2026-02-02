import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './../hooks/useAuth';
import DoctorLayout from './../components/layout/DoctorLayout';

function DoctorRoute() {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "DOCTOR" && user.role !== "ROLE_DOCTOR") return <Navigate to="/login" replace />;

    return (
        <DoctorLayout>
            <Outlet />
        </DoctorLayout>
    );
}

export default DoctorRoute
