import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Stethoscope, Plus } from 'lucide-react';
import './MyAppointment.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCompletedAppointmentsCount, getDoctorsConsultedCount, getAllDoctors, getUpcomingAppointments } from '../../services/patientApi';
import useAuth from '../../hooks/useAuth';

const MyAppointment = () => {
  const { patientId } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [totalDoctorsConsulted, setTotalDoctorsConsulted] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      if (data) {
        setDoctors(data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAppointmentsData = async () => {
    if (!patientId) return;

    try {
      const [completedCount, doctorsCount, upcomingApps] = await Promise.allSettled([
        getCompletedAppointmentsCount(patientId),
        getDoctorsConsultedCount(patientId),
        getUpcomingAppointments(patientId)
      ]);

      if (completedCount.status === 'fulfilled' && completedCount.value) {
        setCompletedAppointments(completedCount.value);
      }
      if (doctorsCount.status === 'fulfilled' && doctorsCount.value) {
        setTotalDoctorsConsulted(doctorsCount.value);
      }
      if (upcomingApps.status === 'fulfilled' && upcomingApps.value) {
        setUpcomingAppointments(upcomingApps.value);
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  useEffect(() => {
    fetchAppointmentsData();
    fetchDoctors();
  }, [patientId]);

  const navigate = useNavigate();

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <div>
          <h1 className="appointments-title">My Appointments</h1>
          <p className="appointments-subtitle">Schedule and manage your appointments with doctors</p>
        </div>
        <button
          className="book-appointment-btn"
          onClick={() => navigate("/patient/appointments/1")}
        >
          <Plus size={20} />
          Book Appointment
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <Calendar className="stat-icon stat-icon-blue" size={32} />
          <div className="stat-content">
            <p className="stat-label">Upcoming</p>
            <p className="stat-value">{upcomingAppointments.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <CheckCircle className="stat-icon stat-icon-green" size={32} />
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{completedAppointments}</p>
          </div>
        </div>

        <div className="stat-card">
          <Stethoscope className="stat-icon stat-icon-purple" size={32} />
          <div className="stat-content">
            <p className="stat-label">Total Doctors</p>
            <p className="stat-value">{totalDoctorsConsulted}</p>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Appointments
        </button>
        <button
          className={`tab ${activeTab === 'past' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Appointments
        </button>
        <button
          className={`tab ${activeTab === 'doctors' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          Find Doctors
        </button>
      </div>

      <div className="appointments-content">
        {activeTab === 'upcoming' && (
          upcomingAppointments.length === 0 ? (
            <div className="empty-state">
              <Calendar className="empty-icon" size={64} strokeWidth={1.5} />
              <h2 className="empty-title">No upcoming appointments</h2>
              <p className="empty-subtitle">You don't have any scheduled appointments.</p>
              <button className="book-appointment-btn-secondary" onClick={() => navigate("/patient/appointments/1")}>
                <Plus size={20} />
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="appointments-list">
              {upcomingAppointments.map(app => (
                <div key={app.appointmentId} className="appointment-card" style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', marginBottom: '16px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: '4px', fontSize: '18px', fontWeight: 600 }}>{app.doctorName || 'Dr. Unknown'}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{app.specialization || 'General Physician'}</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} color="#6b7280" />
                        <span>{app.appointmentDate}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#6b7280' }}>Time:</span>
                        <span>{app.startTime}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '13px', fontWeight: 500 }}>
                      Scheduled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default MyAppointment;