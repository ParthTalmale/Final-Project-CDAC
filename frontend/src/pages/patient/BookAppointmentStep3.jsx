import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { holdSlot } from '../../services/patientApi';
import useAuth from '../../hooks/useAuth';

const BookAppointmentStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctor, date, slot } = location.state || {};
  const { patientId } = useAuth();

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if missing data
  useEffect(() => {
    if (!doctor || !date || !slot) {
      navigate('/patient/appointments/1');
    }
  }, [doctor, date, slot, navigate]);

  const handleConfirm = async () => {
    if (!patientId) {
      setError("Patient ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // "13:00" -> LocalTime formatting might vary, but backend expects LocalTime.
      // If slot.startTime is "13:00:00" or similar.
      // Backend HoldSlotRequestDto: doctorId, patientId, date, startTime, endTime, appointmentType

      // Assuming slot duration is 30 mins for now or 1 hour.
      // We need endTime. Let's add 30 mins to startTime.
      const [hours, minutes] = slot.startTime.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(hours, minutes + 30);
      const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;
      const startTimeFormatted = slot.startTime.length === 5 ? `${slot.startTime}:00` : slot.startTime;

      const payload = {
        doctorId: doctor.doctorId,
        patientId: patientId, // from auth context
        date: date,
        startTime: startTimeFormatted,
        endTime: endTime,
        appointmentType: "CONSULTATION" // Default or let user choose
      };

      const response = await holdSlot(payload);
      console.log("Hold slot response:", response);

      // Navigate to payment
      // response should have appointmentId
      if (response && response.appointmentId) {
        navigate('/patient/payments', {
          state: {
            appointmentId: response.appointmentId,
            amount: 500, // Hardcoded for now
            doctor,
            date,
            slot
          }
        });
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (err) {
      console.error("Error holding slot:", err);
      setError("Failed to hold slot. It might have been taken. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor || !date || !slot) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Book Appointment - Step 3 of 4</h2>
            <p style={styles.subtitle}>Review & Confirm</p>
          </div>
          <button style={styles.closeButton} onClick={() => navigate("/patient/appointments")}>
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicators */}
        <div style={styles.progressContainer}>
          <div style={styles.stepInactive}>1</div>
          <div style={styles.progressLine}></div>
          <div style={styles.stepInactive}>2</div>
          <div style={styles.progressLine}></div>
          <div style={styles.stepActive}>3</div>
          <div style={styles.progressLineInactive}></div>
          <div style={styles.stepInactive}>4</div>
        </div>

        <div style={styles.content}>
          <div style={styles.reviewCard}>
            <h3 style={styles.cardTitle}>Appointment Summary</h3>

            <div style={styles.summaryItem}>
              <div style={styles.iconBox}><User size={20} color="#4f46e5" /></div>
              <div>
                <p style={styles.label}>Doctor</p>
                <p style={styles.value}>{doctor.name || `Dr. ${doctor.username}`}</p>
                <p style={styles.subValue}>{doctor.specialty || doctor.specialization}</p>
              </div>
            </div>

            <div style={styles.summaryItem}>
              <div style={styles.iconBox}><Calendar size={20} color="#4f46e5" /></div>
              <div>
                <p style={styles.label}>Date</p>
                <p style={styles.value}>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div style={styles.summaryItem}>
              <div style={styles.iconBox}><Clock size={20} color="#4f46e5" /></div>
              <div>
                <p style={styles.label}>Time</p>
                <p style={styles.value}>{slot.startTime?.substring(0, 5)}</p>
              </div>
            </div>

            <div style={styles.summaryItem}>
              <div style={styles.iconBox}><FileText size={20} color="#4f46e5" /></div>
              <div style={{ width: '100%' }}>
                <p style={styles.label}>Reason for Visit (Optional)</p>
                <textarea
                  style={styles.textArea}
                  placeholder="Briefly describe your symptoms or reason for visit..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.previousButton} onClick={() => navigate("/patient/appointments/2", { state: { doctor } })}>
            <ArrowLeft size={16} /> Previous
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              ...styles.nextButton,
              ...(loading ? styles.nextButtonDisabled : {})
            }}
          >
            {loading ? 'Processing...' : 'Confirm & Proceed to Pay'}
            {!loading && <ArrowRight size={16} />}
          </button>
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
    maxWidth: '600px',
    height: 'auto',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e5e7eb'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#6b7280'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#9ca3af',
    borderRadius: '50%',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    gap: '0'
  },
  stepActive: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#111827',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    zIndex: 1
  },
  stepInactive: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    zIndex: 1
  },
  progressLine: {
    width: '60px',
    height: '2px',
    backgroundColor: '#111827',
    margin: '0 -4px'
  },
  progressLineInactive: {
    width: '60px',
    height: '2px',
    backgroundColor: '#e5e7eb',
    margin: '0 -4px'
  },
  content: {
    flex: 1,
    padding: '0 24px 24px',
    overflowY: 'auto',
  },
  reviewCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e5e7eb'
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  summaryItem: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px'
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  label: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500'
  },
  value: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  subValue: {
    margin: '2px 0 0 0',
    fontSize: '14px',
    color: '#4b5563'
  },
  textArea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    marginTop: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '80px'
  },
  errorBox: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#b91c1c',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: 'white',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px'
  },
  previousButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  nextButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    border: 'none',
    backgroundColor: '#111827',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'opacity 0.2s'
  },
  nextButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  }
};

export default BookAppointmentStep3;