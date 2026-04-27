export default function StatBar({ label, value, max = 10 }) {
  return (
    <div className="stat-bar">
      <span className="stat-bar-label">{label}</span>
      <div className="stat-bar-track">
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            className={`stat-bar-seg ${i < value ? "stat-bar-seg--filled" : ""}`}
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
      <span className="stat-bar-num">{value}</span>
    </div>
  );
}
