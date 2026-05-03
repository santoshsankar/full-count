const VEL_DOTS = { elite: 4, high: 3, medium: 2, low: 1 };
const VEL_LABEL = { elite: "ELITE", high: "HARD", medium: "AVG", low: "SOFT" };

export default function PitcherCard({ pitcher, pitchHistory = [] }) {
  if (!pitcher) return null;

  const dots = VEL_DOTS[pitcher.velocity] || 2;

  // Show recent pitches from history
  const recent = pitchHistory.slice(-3).reverse();

  return (
    <div className="pitcher-card px-box">
      <div className="pitcher-card__header">
        <span className="pitcher-card__badge">ON THE MOUND</span>
        <div className="pitcher-card__vel" title={`Velocity: ${VEL_LABEL[pitcher.velocity] || ""}`}>
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={`vel-dot ${i < dots ? "vel-dot--on" : ""}`}
            />
          ))}
          <span className="pitcher-card__vel-label">VELO</span>
        </div>
      </div>
      <div className="pitcher-card__body">
        <div className="pitcher-card__name-wrap">
          <span className="pitcher-card__name">{pitcher.playerName}</span>
          <span className="pitcher-card__archetype">{pitcher.archetype}</span>
        </div>
        <div className="pitcher-card__tendency">{pitcher.tendency}</div>
        {recent.length > 0 && (
          <div className="pitcher-card__history">
            <span className="pitcher-card__hist-label">LAST PITCH:</span>
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
