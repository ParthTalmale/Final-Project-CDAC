import React, { useEffect } from 'react';
import { CheckCircle, Calendar, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookAppointmentStep4 = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.content}>
          <div style={styles.iconContainer}>
            <CheckCircle size={64} color="#10b981" strokeWidth={1.5} />
          </div>

          <h2 style={styles.title}>Appointment Confirmed!</h2>
          <p style={styles.subtitle}>
            Your appointment has been successfully scheduled. <br />
            We have sent a confirmation email to your registered address.
          </p>

          <div style={styles.buttonGroup}>
            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/patient/dashboard")}
            >
              <Home size={18} />
              Go to Dashboard
            </button>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/patient/appointments")}
            >
              <Calendar size={18} />
              View Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    padding: '40px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    textAlign: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconContainer: {
    marginBottom: '24px',
    animation: 'scaleIn 0.5s ease-out'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827'
  },
  subtitle: {
    margin: '0 0 32px 0',
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.5'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%'
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%'
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%'
  }
};

export default BookAppointmentStep4;