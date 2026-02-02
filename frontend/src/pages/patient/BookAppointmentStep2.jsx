import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ArrowLeft, ArrowRight, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAvailableSlots } from '../../services/patientApi';

const BookAppointmentStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctor } = location.state || {}; // Add defensive check

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(null);

  // Redirect if no doctor selected
  useEffect(() => {
    if (!doctor) {
      navigate('/patient/appointments/1');
    }
  }, [doctor, navigate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, isNext: true });
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = async (day) => {
    if (!day.isCurrentMonth) return;

    // Construct date string YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayDate = String(day.day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayDate}`;

    // Prevent selecting past dates
    const selected = new Date(year, currentDate.getMonth(), day.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return;

    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setError(null);
    setLoading(true);
    setSlots([]);

    try {
      const data = await getAvailableSlots({
        doctorId: doctor.doctorId,
        date: dateStr
      });
      // Handle different response structures if needed, but assuming array based on API
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setError("Failed to fetch slots. Please try different date.");
    } finally {
      setLoading(false);
    }
  };

  const days = getDaysInMonth(currentDate);

  const handleNext = () => {
    if (selectedSlot) {
      navigate('/patient/appointments/3', {
        state: {
          doctor,
          date: selectedDate,
          slot: selectedSlot
        }
      });
    }
  };

  if (!doctor) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Book Appointment - Step 2 of 4</h2>
            <p style={styles.subtitle}>Select Date & Time</p>
          </div>
          <button style={styles.closeButton} onClick={() => navigate("/patient/appointments")}>
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicators */}
        <div style={styles.progressContainer}>
          <div style={styles.stepInactive}>1</div>
          <div style={styles.progressLine}></div>
          <div style={styles.stepActive}>2</div>
          <div style={styles.progressLineInactive}></div>
          <div style={styles.stepInactive}>3</div>
          <div style={styles.progressLineInactive}></div>
          <div style={styles.stepInactive}>4</div>
        </div>

        <div style={styles.content}>
          <div style={styles.twoColumnGrid}>

            {/* Left Col: Calendar */}
            <div style={styles.leftCol}>
              <div style={styles.doctorSummary}>
                <p style={styles.bookingWithText}>Booking with</p>
                <div style={styles.miniDoctorRow}>
                  <div style={styles.miniAvatar}>{doctor.name ? doctor.name[0] : 'D'}</div>
                  <div>
                    <p style={styles.miniDoctorName}>{doctor.name || `Dr. ${doctor.username}`}</p>
                    <p style={styles.miniDoctorSpecialty}>{doctor.specialty || doctor.specialization}</p>
                  </div>
                </div>
              </div>

              <div style={styles.calendarContainer}>
                <div style={styles.calendarHeader}>
                  <button style={styles.navButton} onClick={handlePrevMonth}>
                    <ChevronLeft size={20} />
                  </button>
                  <h3 style={styles.monthYear}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button style={styles.navButton} onClick={handleNextMonth}>
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div style={styles.calendar}>
                  {daysOfWeek.map((day) => (
                    <div key={day} style={styles.dayHeader}>
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) => {
                    const year = currentDate.getFullYear();
                    const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const dayStr = String(day.day).padStart(2, '0');
                    const dateStr = `${year}-${monthStr}-${dayStr}`;
                    const isSelected = selectedDate === dateStr;
                    const isPast = day.isCurrentMonth && new Date(year, currentDate.getMonth(), day.day) < new Date().setHours(0, 0, 0, 0);

                    return (
                      <button
                        key={index}
                        disabled={!day.isCurrentMonth || isPast}
                        style={{
                          ...styles.dayCell,
                          ...(day.isCurrentMonth ? (isPast ? styles.dayCellDisabled : styles.dayCellCurrent) : styles.dayCellOther),
                          ...(isSelected && day.isCurrentMonth ? styles.dayCellSelected : {})
                        }}
                        onClick={() => handleDateClick(day)}
                      >
                        {day.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: Slots */}
            <div style={styles.rightCol}>
              <h3 style={styles.sectionTitle}>Available Slots</h3>
              {!selectedDate ? (
                <div style={styles.emptySlotsState}>
                  <CalendarIcon size={48} color="#d1d5db" />
                  <p>Select a date to view available time slots</p>
                </div>
              ) : loading ? (
                <div style={styles.emptySlotsState}>
                  <div className="spinner-border text-primary" role="status"></div>
                  <p style={{ marginTop: 10 }}>Loading slots...</p>
                </div>
              ) : error ? (
                <div style={styles.errorState}>
                  <AlertCircle size={24} color="#ef4444" />
                  <p>{error}</p>
                </div>
              ) : slots.length === 0 ? (
                <div style={styles.emptySlotsState}>
                  <p>No slots available for this date.</p>
                </div>
              ) : (
                <div style={styles.slotsGrid}>
                  {slots.map((slot, index) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <button
                        key={index}
                        disabled={!slot.available}
                        style={{
                          ...styles.slotButton,
                          ...(!slot.available ? styles.slotDisabled : {}),
                          ...(isSelected ? styles.slotSelected : {})
                        }}
                        onClick={() => slot.available && setSelectedSlot(slot)}
                      >
                        <Clock size={14} style={{ marginRight: 6 }} />
                        {slot.startTime?.substring(0, 5)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.previousButton} onClick={() => navigate("/patient/appointments/1")}>
            <ArrowLeft size={16} /> Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedSlot}
            style={{
              ...styles.nextButton,
              ...(!selectedSlot ? styles.nextButtonDisabled : {})
            }}
          >
            Next <ArrowRight size={16} />
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
    maxWidth: '800px',
    height: '90vh',
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
    padding: '0 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  twoColumnGrid: {
    display: 'flex',
    gap: '32px',
    height: '100%',
    flexWrap: 'wrap'
  },
  leftCol: {
    flex: '1',
    minWidth: '300px'
  },
  rightCol: {
    flex: '1',
    borderLeft: '1px solid #e5e7eb',
    paddingLeft: '32px',
    minWidth: '300px'
  },
  doctorSummary: {
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  bookingWithText: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  miniDoctorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  miniAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600'
  },
  miniDoctorName: {
    margin: 0,
    fontWeight: '600',
    color: '#111827'
  },
  miniDoctorSpecialty: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280'
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '20px'
  },
  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  monthYear: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  navButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#6b7280',
    borderRadius: '4px'
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    padding: '8px 0',
  },
  dayCell: {
    aspectRatio: '1',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  dayCellCurrent: {
    color: '#111827',
    ':hover': {
      backgroundColor: '#f3f4f6'
    }
  },
  dayCellOther: {
    color: '#d1d5db'
  },
  dayCellDisabled: {
    color: '#d1d5db',
    cursor: 'not-allowed',
    textDecoration: 'line-through'
  },
  dayCellSelected: {
    backgroundColor: '#111827',
    color: 'white'
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  emptySlotsState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    color: '#9ca3af',
    textAlign: 'center'
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    color: '#ef4444',
    textAlign: 'center'
  },
  slotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px'
  },
  slotButton: {
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#111827',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  slotDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
    borderColor: '#f3f4f6'
  },
  slotSelected: {
    backgroundColor: '#111827',
    color: 'white',
    borderColor: '#111827'
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
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    cursor: 'not-allowed'
  }
};

export default BookAppointmentStep2;