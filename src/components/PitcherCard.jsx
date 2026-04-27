const VEL_DOTS = { elite: 4, high: 3, medium: 2, low: 1 };

export default function PitcherCard({ pitcher, pitchHistory = [] }) {
  if (!pitcher) return null;

  const dots = VEL_DOTS[pitcher.velocity] || 2;

  // Show recent pitches from history
  const recent = pitchHistory.slice(-3).reverse();

  return (
    <div className="pitcher-card px-box">
      <div className="pitcher-card__header">
        <span className="pitcher-card__badge">PITCHING</span>
        <div className="pitcher-card__vel">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={`vel-dot ${i < dots ? "vel-dot--on" : ""}`}
            />
          ))}
        </div>
      </div>
      <div className="pitcher-card__body">
        <div className="pitcher-card__name">{pitcher.shortName}</div>
        <div className="pitcher-card__tendency">{pitcher.tendency}</div>
        {recent.length > 0 && (
          <div className="pitcher-card__history">
            <span className="pitcher-card__hist-label">LAST:</span>
            {recent.map((p, i) => (
              <span key={i} className="pitcher-card__hist-pitch">
                {p.pitch}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
