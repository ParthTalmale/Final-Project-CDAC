import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AppointmentsMonitor() {
  return (
    <div className="container mt-4">

      <div className="row g-4">

        {/* LEFT PART */}
        <div className="col-lg-8 border rounded p-3">

          <h5 className="mb-4">
            <span role="img" aria-label="clock">🕒</span>{" "}
            Daily Schedule - 22/01/2024
          </h5>

          {/* Appointment 1 */}
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-light text-dark me-2">09:00</span>
                <span className="badge bg-primary me-2">consultation</span>
                <span className="badge bg-dark ms-auto">confirmed</span>
              </div>
              <h5>John Doe</h5>
              <div className="text-muted">with Dr. Smith • 30 min</div>
              <div className="text-muted">Room 101</div>
              <div className="text-secondary fst-italic mt-2">
                Regular checkup
              </div>
            </div>
          </div>

          {/* Appointment 2 */}
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-light text-dark me-2">10:30</span>
                <span className="badge bg-success me-2">follow-up</span>
                <span className="badge bg-light text-dark ms-auto">
                  scheduled
                </span>
              </div>
              <h5>Sarah Wilson</h5>
              <div className="text-muted">with Dr. Johnson • 45 min</div>
              <div className="text-muted">Room 103</div>
              <div className="text-secondary fst-italic mt-2">
                Post-surgery follow-up
              </div>
            </div>
          </div>

          {/* Appointment 3 */}
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-light text-dark me-2">14:00</span>
                <span className="badge bg-danger me-2">surgery</span>
                <span className="badge bg-dark ms-auto">confirmed</span>
              </div>
              <h5>Mike Brown</h5>
              <div className="text-muted">with Dr. Davis • 60 min</div>
              <div className="text-muted">OR-2</div>
              <div className="text-secondary fst-italic mt-2">
                Minor surgery procedure
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4">

          {/* Quick Actions */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-3">Quick Actions</h5>

              <button className="btn btn-outline-secondary w-100 mb-2">
                📅 View Weekly Schedule
              </button>
              <button className="btn btn-outline-secondary w-100 mb-2">
                🏥 Check Room Availability
              </button>
              <button className="btn btn-outline-secondary w-100">
                👨‍⚕️ Doctor Schedules
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-4">Today's Statistics</h5>

              <div className="d-flex justify-content-between border-bottom pb-1">
                <span>Total Appointments</span>
                <strong>3</strong>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-1 mt-2">
                <span>Confirmed</span>
                <strong>2</strong>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-1 mt-2">
                <span>Pending</span>
                <strong>1</strong>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Completed</span>
                <strong>0</strong>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
