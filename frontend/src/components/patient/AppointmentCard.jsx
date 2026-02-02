export default function AppointmentCard({ doctor, dept, date, status }) {
    return (
        <div className="card p-3 mb-3 border-0 bg-light rounded-4">
            <h6 className="fw-bold mb-1">{doctor}</h6>
            <p className="text-muted small mb-1">{dept}</p>

            <div className="d-flex justify-content-between">
                <p className="small mb-0">
                    <i className="bi bi-calendar me-2"></i> {date}
                </p>

                <span className={`badge ${status === "Confirmed" ? "bg-dark" : "bg-secondary"
                    }`}>
                    {status}
                </span>
            </div>
        </div>
    );
}
