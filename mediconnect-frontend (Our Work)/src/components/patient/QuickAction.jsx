export default function QuickActionCard({ icon, label }) {
    return (
        <div className="card p-3 text-center shadow-sm rounded-4">
            <i className={`bi ${icon} fs-2 mb-2`}></i>
            <p className="fw-bold m-0">{label}</p>
        </div>
    );
}
