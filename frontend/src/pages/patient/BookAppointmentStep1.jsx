import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, Search, Star, Briefcase, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllDoctors } from '../../services/patientApi';

const BookAppointmentStep1 = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getAllDoctors();
        // Ensure data is an array
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const nameMatch = doc.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const specialtyMatch = doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || specialtyMatch;
  });

  const handleDoctorSelect = (doctor) => {
    navigate("/patient/appointments/2", { state: { doctor } });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Book Appointment - Step 1 of 4</h2>
            <p style={styles.subtitle}>Select a Specialist</p>
          </div>
          <button style={styles.closeButton} onClick={() => navigate("/patient/appointments")}>
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicators */}
        <div style={styles.progressContainer}>
          <div style={styles.stepActive}>1</div>
          <div style={styles.progressLineInactive}></div>
          <div style={styles.stepInactive}>2</div>
          <div style={styles.progressLineInactive}></div>
          <div style={styles.stepInactive}>3</div>
          <div style={styles.progressLineInactive}></div>
          <div style={styles.stepInactive}>4</div>
        </div>

        {/* Search */}
        <div style={styles.content}>
          <div style={styles.searchContainer}>
            <Search style={styles.searchIcon} size={20} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.doctorList}>
            {loading ? (
              <div style={styles.centerMessage}>Loading doctors...</div>
            ) : error ? (
              <div style={{ ...styles.centerMessage, color: 'red' }}>{error}</div>
            ) : filteredDoctors.length === 0 ? (
              <div style={styles.centerMessage}>No doctors found matching your criteria.</div>
            ) : (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  style={styles.doctorCard}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div style={styles.doctorAvatar}>
                    <User size={32} color="white" />
                  </div>
                  <div style={styles.doctorInfo}>
                    <p style={styles.doctorName}>{doctor.name || `Dr. ${doctor.username}`}</p>
                    <p style={styles.doctorSpecialty}>{doctor.specialty || doctor.specialization || 'General Physician'}</p>
                    <div style={styles.doctorMeta}>
                      <span style={styles.metaItem}>
                        <Star size={14} fill="#fbbf24" stroke="#fbbf24" style={{ marginRight: 4 }} />
                        {doctor.rating || '4.5'}
                      </span>
                      <span style={styles.metaItem}>
                        <Briefcase size={14} style={{ marginRight: 4 }} />
                        {doctor.experience || '5'} years
                      </span>
                    </div>
                  </div>
                  <button style={styles.selectButton}>
                    Select
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.cancelButton} onClick={() => navigate("/patient/appointments")}>
            Cancel
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
    height: '90vh', // Changed to fixed height for consistency
    maxHeight: '800px',
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
    transition: 'background-color 0.2s',
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
  progressLineInactive: {
    width: '60px',
    height: '2px',
    backgroundColor: '#e5e7eb',
    margin: '0 -4px'
  },
  content: {
    flex: 1,
    padding: '0 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '20px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  doctorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingBottom: '20px'
  },
  doctorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: 'white',
    transition: 'all 0.2s ease',
  },
  doctorAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  doctorInfo: {
    flex: 1
  },
  doctorName: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  doctorSpecialty: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    color: '#6b7280'
  },
  doctorMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '13px',
    color: '#4b5563'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center'
  },
  selectButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    color: '#111827',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  centerMessage: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
    fontSize: '14px'
  },
  footer: {
    padding: '20px 24px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px'
  },
  cancelButton: {
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  }
};

export default BookAppointmentStep1;