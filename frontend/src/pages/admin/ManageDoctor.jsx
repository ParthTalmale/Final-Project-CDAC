import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getAllDoctors } from "../../services/adminsApi";
import { getAllDepartments } from "../../services/departmentsApi";

export default function DoctorManagement() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  useEffect(() => {
    loadData();
  }, [page, selectedDept]); // Reload when page or department changes

  // Debounce search or add a button? Let's use a button or Enter key for search to avoid spam, 
  // or just add it to useEffect if user prefers live search.
  // Converting search input to controlled.

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("ManageDoctor: loadData triggered. Dept:", selectedDept, "Search:", searchTerm);
      const [doctorsData, departmentsData] = await Promise.all([
        getAllDoctors(page, 6, searchTerm, selectedDept),
        getAllDepartments()
      ]);
      setDoctors(doctorsData.content);
      setTotalPages(doctorsData.totalPages);
      setDepartments(departmentsData);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0); // Reset to page 0
    loadData();
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="container py-4">

      {/* ---- HEADER ---- */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold">Doctor Management</h2>
          <p className="text-muted m-0">
            Manage doctor profiles, schedules, and information
          </p>
        </div>

        <button
          className="btn btn-dark px-4 py-2 rounded-3 fw-semibold shadow-sm"
          onClick={() => navigate("/admin/staff/registration")}
        >
          + Add Doctor
        </button>
      </div>


      {/* ---- SEARCH + FILTER ---- */}
      <div className="row g-3 mb-4 align-items-center">

        <div className="col-lg-6">
          <div className="input-group shadow-sm rounded-3">
            <span
              className="input-group-text bg-white border-end-0"
              style={{ cursor: 'pointer' }}
              onClick={handleSearch}
            >
              🔍
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search doctor by name, specialization or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        <div className="col-lg-3">
          <select 
            className="form-select shadow-sm rounded-3"
            value={selectedDept}
            onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(0);
            }}
          >
            <option value="All Departments">All Departments</option>
            {departments.map((d) => (
              <option key={d.id || d.deptName} value={d.deptName}>{d.deptName}</option>
            ))}
          </select>
        </div>

        <div className="col-lg-3">
          <select className="form-select shadow-sm rounded-3">
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
          </select>
        </div>

      </div>


      {/* ---- CARDS ---- */}
      <div className="row g-4">

        {loading ? (
          <div className="text-center w-100 py-5">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger w-100">{error}</div>
        ) : (
          <>
            {doctors.map((doctor) => (
              <div className="col-lg-4" key={doctor.id}>
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 h-100"
                  style={{ transition: "0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0px)"}
                >

                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-light d-flex justify-content-center align-items-center shadow-sm me-3"
                      style={{ width: "65px", height: "65px", fontWeight: "600", fontSize: "1.1rem" }}
                    >
                      {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>

                    <div>
                      <h5 className="mb-1 fw-semibold text-truncate" style={{ maxWidth: "180px" }}>{doctor.name}</h5>
                      <span className="badge bg-dark rounded-pill">active</span>
                    </div>
                  </div>

                  <div className="mt-3 text-muted small">
                    {doctor.departmentName} <br />
                    {doctor.specialization} <br />
                    {doctor.yearsOfExperience}+ years <br />
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <span>Joined</span>
                    <strong>{doctor.dateOfJoining}</strong>
                  </div>
                </div>
              </div>
            ))}

            {/* Filler Card if less than 3 items to maintain grid look (optional, skipping for now) */}
          </>
        )}
      </div>

      {/* ---- PAGINATION ---- */}
      {!loading && !error && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-outline-dark"
            onClick={handlePrev}
            disabled={page === 0}
          >
            &larr; Previous
          </button>

          <span className="fw-semibold">
            Page {page + 1} of {totalPages === 0 ? 1 : totalPages}
          </span>

          <button
            className="btn btn-outline-dark"
            onClick={handleNext}
            disabled={page >= totalPages - 1}
          >
            Next &rarr;
          </button>
        </div>
      )}

    </div>
  );
}
