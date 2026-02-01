export default function QuickActionCard({ icon, label, onClick }) {
    return (
        <div
            className="card p-3 text-center shadow-sm rounded-4 h-100"
            onClick={onClick}
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <i className={`bi ${icon} fs-2 mb-2 text-primary`}></i>
            <p className="fw-bold m-0">{label}</p>
        </div>
    );
}
