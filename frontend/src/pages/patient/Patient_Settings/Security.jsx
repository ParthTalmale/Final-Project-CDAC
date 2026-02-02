import React, { useState } from "react";

export default function App() {
  const [twoFA, setTwoFA] = useState(true);
  const [autoLock, setAutoLock] = useState("15 minutes");
  const [passwordLevel, setPasswordLevel] = useState("High");

  return (
    <div className="py-2 w-100">

      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">🛡 Access Control</h5>

     
        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <div className="fw-semibold">Require Two-Factor Authentication</div>
            <small className="text-muted">
              Enhanced security for all user accounts
            </small>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={twoFA}
              onChange={() => setTwoFA(!twoFA)}
            />
          </div>
        </div>

    
        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <div className="fw-semibold">Auto-lock after inactivity</div>
            <small className="text-muted">
              Automatically lock system after period of inactivity
            </small>
          </div>

          <select
            className="form-select w-auto"
            value={autoLock}
            onChange={(e) => setAutoLock(e.target.value)}
          >
            <option>5 minutes</option>
            <option>10 minutes</option>
            <option>15 minutes</option>
            <option>30 minutes</option>
          </select>
        </div>


        <div className="d-flex justify-content-between align-items-center py-3">
          <div>
            <div className="fw-semibold">Password Requirements</div>
            <small className="text-muted">
              Minimum password complexity
            </small>
          </div>

          <select
            className="form-select w-auto"
            value={passwordLevel}
            onChange={(e) => setPasswordLevel(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>


      <div className="card p-3 shadow-sm">
        <h5 className="mb-3">User Roles & Permissions</h5>

        {[
          {
            role: "Administrator",
            desc: "Full system access",
            badge: "dark",
          },
          {
            role: "Doctor",
            desc: "Patient records and appointments",
            badge: "secondary",
          },
          {
            role: "Nurse",
            desc: "Patient care and basic records",
            badge: "secondary",
          },
          {
            role: "Receptionist",
            desc: "Appointments and basic patient info",
            badge: "secondary",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center border-bottom py-3"
          >
            <div className="d-flex align-items-center gap-3">
              <span className={`badge bg-${item.badge}`}>
                {item.role}
              </span>
              <span>{item.desc}</span>
            </div>
            <button className="btn btn-outline-secondary btn-sm">
              Edit
            </button>
          </div>
        ))}
      </div>


      <div className="text-end mt-4">
        <button className="btn btn-dark px-4">💾 Save Settings</button>
      </div>
    </div>
  );
}
