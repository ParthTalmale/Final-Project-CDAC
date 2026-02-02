import React from "react";

export default function Appearance() {
  return (
    <div className="py-2 w-100">

      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">🎨 Theme & Display</h5>


        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <div className="fw-semibold">Dark Mode</div>
            <small className="text-muted">Switch to dark theme</small>
          </div>
          <div className="form-check form-switch">
            <input type="checkbox" className="form-check-input" role="switch" />
          </div>
        </div>


        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <div className="fw-semibold">Compact Mode</div>
            <small className="text-muted">Reduce spacing and padding</small>
          </div>
          <div className="form-check form-switch">
            <input type="checkbox" className="form-check-input" role="switch" />
          </div>
        </div>


        <div className="d-flex justify-content-between align-items-center py-3">
          <div>
            <div className="fw-semibold">Font Size</div>
            <small className="text-muted">Adjust text size</small>
          </div>
          <select className="form-select w-auto">
            <option>Small</option>
            <option selected>Medium</option>
            <option>Large</option>
          </select>
        </div>
      </div>


      <div className="text-end mt-4">
        <button className="btn btn-dark px-4">💾 Save Settings</button>
      </div>
    </div>
  );
}
