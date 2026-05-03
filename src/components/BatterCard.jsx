import StatBar from "./StatBar";
import { useState } from "react";

export default function BatterCard({ batter, compact = false }) {
  const [weakOpen, setWeakOpen] = useState(false);

  if (!batter) return null;

  return (
    <div className="batter-card px-box">
      <div className="batter-card__header">
        <span className="batter-card__badge batter-card__badge--bat">AT THE PLATE</span>
        <div className="batter-card__name-wrap">
          <span className="batter-card__name">{batter.playerName}</span>
          <span className="batter-card__archetype">{batter.archetype}</span>
        </div>
      </div>
      <div className="batter-card__body">
        {batter.blurb && (
          <p className="batter-card__blurb">{batter.blurb}</p>
        )}
        <div className="batter-card__stats">
          <StatBar label="POWER"   value={batter.power}      />
          <StatBar label="CONTACT" value={batter.contact}    />
          <StatBar label="EYE"     value={batter.discipline} />
        </div>

        {!compact && (
          <>
            <div className="batter-card__section-label">WHAT HE DOES</div>
            <div className="batter-card__tendencies">
              {batter.tendencies.map((t, i) => (
                <div key={i} className="batter-card__tendency">{t}</div>
              ))}
            </div>

            <button
              className="batter-card__weak-toggle"
              onClick={() => setWeakOpen(o => !o)}
            >
              HOW TO GET HIM OUT {weakOpen ? "▲" : "▼"}
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
