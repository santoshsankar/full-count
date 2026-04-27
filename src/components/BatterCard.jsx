import StatBar from "./StatBar";
import { useState } from "react";

const DIFF_COLORS = {
  rookie:  "var(--px-green)",
  pro:     "var(--px-gold)",
  allstar: "var(--px-red)",
};

export default function BatterCard({ batter, compact = false }) {
  const [weakOpen, setWeakOpen] = useState(false);

  if (!batter) return null;

  return (
    <div className="batter-card px-box">
      <div className="batter-card__header">
        <span className="batter-card__badge batter-card__badge--bat">BATTING</span>
        <span className="batter-card__name">{batter.shortName}</span>
      </div>
      <div className="batter-card__body">
        <div className="batter-card__stats">
          <StatBar label="PWR" value={batter.power}      />
          <StatBar label="CON" value={batter.contact}    />
          <StatBar label="EYE" value={batter.discipline} />
        </div>

        {!compact && (
          <>
            <div className="batter-card__section-label">TENDENCIES</div>
            <div className="batter-card__tendencies">
              {batter.tendencies.map((t, i) => (
                <div key={i} className="batter-card__tendency">{t}</div>
              ))}
            </div>

            <button
              className="batter-card__weak-toggle"
              onClick={() => setWeakOpen(o => !o)}
            >
              WEAK SPOTS {weakOpen ? "▲" : "▼"}
            </button>
            {weakOpen && (
              <div className="batter-card__weaknesses">
                {batter.weaknesses.map((w, i) => (
                  <div key={i} className="batter-card__weakness">{w}</div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
