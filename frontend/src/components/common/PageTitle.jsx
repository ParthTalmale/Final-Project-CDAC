export default function PageTitle({ title, subtitle }) {
    return (
        <>
            <h2 className="fw-bold">{title}</h2>
            {subtitle && <p className="text-muted">{subtitle}</p>}
        </>
    );
}
