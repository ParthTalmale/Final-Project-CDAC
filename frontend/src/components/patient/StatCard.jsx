export default function StatCard({ label, value, icon, iconColor }) {
    return (
        <div className="card shadow-sm p-3 rounded-4">
            <p className="text-muted mb-1">{label}</p>

            <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold">{value}</h4>
                <i className={`bi ${icon} fs-3`} style={{ color: iconColor }}></i>
            </div>
        </div>
    );
}
