import React, { useState, useEffect } from "react";
import "./settings.css";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function Settings() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("General");
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = ["General", "Notification", "Security", "System", "Appearance"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    const roleBase = {
      PATIENT: "/patient/settings",
      DOCTOR: "/doctor/settings",
      ADMIN: "/admin/settings",
    };

    navigate(`${roleBase[user.role]}/${tab.toLowerCase()}`);
  };

  const days = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday",
  ];

  useEffect(() => {
    const path = location.pathname.split("/")[2] || "general";
    const tabName = tabs.find((tab) => tab.toLowerCase() === path);
    if (tabName) setActiveTab(tabName);
  }, [location.pathname]);


  return (
    <>
      <h3>Settings</h3>
      <p>Manage your hospital management system preferences</p>


      <nav className="settings-navbar sticky-top bg-light mb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`settings-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>


      <div className="settings-content mb-4">
        <Outlet />
      </div>


      {activeTab === "General" && (
        <>

          <div className="hInfo card p-4 mb-4">
            <h5 className="mb-4 d-flex align-items-center">
              <span className="me-2">🏥</span> Hospital Information
            </h5>

            <form>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Hospital Name</label>
                  <input type="text" className="form-control" placeholder="MedCare General Hospital" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Hospital ID</label>
                  <input type="text" className="form-control" placeholder="MCH-001" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" placeholder="123 Healthcare Ave, Medical City" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact Phone</label>
                  <input type="tel" className="form-control" placeholder="+91-9874563210" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Timezone</label>
                  <select className="form-select">
                    <option>Indian Standard Time</option>
                    <option>Central Standard Time</option>
                    <option>Mountain Standard Time</option>
                    <option>Eastern Standard Time</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Language</label>
                  <select className="form-select">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </form>
          </div>


          <div className="operatingHours card p-4 w-100 mb-4">
            <h5 className="mb-4 d-flex align-items-center">
              <span className="me-2">⏰</span> Operating Hours
            </h5>

            {days.map((day) => (
              <div className="row align-items-center mb-3 d-flex justify-content-between" key={day}>
                <div className="col-md-3">
                  <strong>{day}</strong>
                </div>

                <div className="col-md-7 d-flex align-items-center justify-content-end">
                  <input type="time" className="form-control me-2" />
                  <span className="mx-2">to</span>
                  <input type="time" className="form-control me-3" defaultValue="18:00" />
                </div>

                <div className="col-md-2 d-flex justify-content-end">
                  <label className="switch">
                    <input type="checkbox" defaultChecked={day !== "Sunday"} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="text-end mt-4">
            <button className="btn btn-dark px-4">💾 Save Settings</button>
          </div>
        </>
      )}


    </>
  );
}

export default Settings;
