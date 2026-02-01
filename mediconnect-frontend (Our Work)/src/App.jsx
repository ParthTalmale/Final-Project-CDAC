import { Routes, Route, Navigate } from "react-router-dom";

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientRoute from "./routing/PatientRoute";
import Login from './pages/auth/Login';
import Register from "./pages/auth/RegisterPatient";

// Settings pages
import SettingsLayout from './pages/patient/Patient_Settings/SettingsLayout';
import Notification from './pages/patient/Patient_Settings/Notification';
import Appearance from './pages/patient/Patient_Settings/Appearance';
import EditProfile from './pages/patient/Patient_Settings/EditProfile';

import LandingPage from './pages/LandingPage/LandingPage';
import MedicalRecords from "./pages/patient/MedicalRecord";
import EmergencyContacts from './pages/patient/EmergencyContact';
import DoctorRoute from "./routing/DoctorRoute";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import DoctorReports from "./components/doctor/DoctorReports";
import Prescription from "./components/doctor/Prescription";
import AdminRoute from './routing/AdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminStaffRegistration from "./pages/admin/AdminStaffRegistration";
import StaffDirectory from "./pages/admin/AdminStaffDirectory";
import AppointmentsMonitor from "./pages/admin/AppointmentMonitor";
import DoctorManagement from "./pages/admin/ManageDoctor";
import DoctorSchedule from './pages/doctor/Doctor_Schedule';
import NurseManagement from "./pages/admin/AdminNurses";
import PatientManagement from "./pages/admin/PatientManagement";
import MyAppointment from "./pages/patient/MyAppointment";
import BookAppointmentStep1 from "./pages/patient/BookAppointmentStep1";
import BookAppointmentStep2 from './pages/patient/BookAppointmentStep2';
import CompletePayment from './pages/patient/CompletePayment';
import BookAppointmentStep3 from './pages/patient/BookAppointmentStep3';
import BookAppointmentStep4 from './pages/patient/BookAppointmentStep4';
import PatientRecords1 from './pages/admin/PatientRecords';


export default function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient Protected Routes */}
      <Route path="/patient" element={<PatientRoute />}>

        {/* Patient Dashboard */}
        <Route path="dashboard" element={<PatientDashboard />} />

        {/* Patient Medical Records */}
        <Route path="records" element={<MedicalRecords />} />

        {/* Patient Appointments */}
        <Route path="appointments" element={<MyAppointment />}>
          <Route path="1" element={<BookAppointmentStep1 />} />
          <Route path="2" element={<BookAppointmentStep2 />} />
          <Route path="3" element={<BookAppointmentStep3 />} />
          <Route path="4" element={<BookAppointmentStep4 />} />
        </Route>
        <Route path="payments" element={<CompletePayment />} />


        {/* Patient Medical Emergency Contact */}
        <Route path="emergency" element={<EmergencyContacts />} />

        {/* Patient Settings */}
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="notification" />} />
          <Route path="notification" element={<Notification />} />
          <Route path="appearance" element={<Appearance />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

      </Route>

      {/* Doctor Protected Routes */}
      <Route path="/doctor" element={<DoctorRoute />}>
        <Route path="dashboard" element={<DoctorDashboard />} />

        <Route path="schedule" element={<DoctorSchedule />} />



        <Route path="reports" element={<DoctorReports />} />
        <Route path="prescriptions" element={<Prescription />} />
        <Route path="appointments" element={<DoctorSchedule />} />
        {/* <Route path="settings" element={<Settings />}>
          <Route index element={<div />} />
          <Route path="general" element={<div />} />
          <Route path="notification" element={<Notification />} />
          <Route path="security" element={<Security />} />
          <Route path="system" element={<System />} />
          <Route path="appearance" element={<Appearance />} />
        </Route> */}
      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="staff">
          <Route path="registration" element={<AdminStaffRegistration />} />
          <Route path="prescriptions" element={<Prescription />} />
          <Route path="directory" element={<StaffDirectory />} />
        </Route>
        <Route path="appointments" element={<AppointmentsMonitor />} />
        <Route path="doctors" element={<DoctorManagement />} />
        <Route path="nurses" element={<NurseManagement />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="records" element={<PatientRecords1 />} />


        {/* <Route path="staff" element={<StaffRegistration />} />
        <Route path="doctors" element={<ManageDoctors />} /> */}

        {/* <Route path="settings" element={<Settings />}>
          <Route index element={<div />} />
          <Route path="general" element={<div />} />
          <Route path="notification" element={<Notification />} />
          <Route path="security" element={<Security />} />
          <Route path="system" element={<System />} />
          <Route path="appearance" element={<Appearance />} />
        </Route> */}
      </Route>


    </Routes>
  );
}
