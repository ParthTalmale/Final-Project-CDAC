import React from "react";

export default function App() {
  return (
    <div className="py-2 w-100">

      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">💾 Data Management</h5>


        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <div className="fw-semibold">Automatic Backups</div>
            <small className="text-muted">
              Schedule regular data backups
            </small>
          </div>

          <select className="form-select w-auto">
            <option>Hourly</option>
            <option selected>Daily</option>
            <option>Weekly</option>
          </select>
        </div>


        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <div className="fw-semibold">Data Retention Period</div>
            <small className="text-muted">
              How long to keep historical data
            </small>
          </div>

          <select className="form-select w-auto">
            <option>1 Year</option>
            <option>3 Years</option>
            <option selected>7 Years</option>
            <option>Forever</option>
          </select>
        </div>


        <div className="d-flex gap-2 pt-3">
          <button className="btn btn-outline-secondary">
            ⬇ Export Data
          </button>
          <button className="btn btn-outline-secondary">
            ⬆ Import Data
          </button>
        </div>
      </div>


      <div className="card p-3 shadow-sm">
        <h5 className="mb-3">System Information</h5>

        <div className="row">
          <div className="col-6 mb-3">
            <div className="text-muted small">Software Version</div>
            <div className="fw-semibold">HMS v2.4.1</div>
          </div>

          <div className="col-6 mb-3">
            <div className="text-muted small">Last Update</div>
            <div className="fw-semibold">January 15, 2024</div>
          </div>

          <div className="col-6">
            <div className="text-muted small">Database Size</div>
            <div className="fw-semibold">2.3 GB</div>
          </div>

          <div className="col-6">
            <div className="text-muted small">Active Users</div>
            <div className="fw-semibold">45 users</div>
          </div>
        </div>
      </div>


      <div className="text-end mt-4">
        <button className="btn btn-dark px-4">💾 Save Settings</button>
      </div>
    </div>
  );
}
