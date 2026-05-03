import { useEffect, useState } from "react";

const VARIANTS = {
  pitching: {
    eyebrow: "TOP OF THE INNING",
    title: "YOU'RE ON THE MOUND",
    subtitle: "Pick a pitch type and a location. Try to attack his weak spots.",
    accent: "var(--px-red)",
  },
  batting: {
    eyebrow: "BOTTOM OF THE INNING",
    title: "YOU'RE AT THE PLATE",
    subtitle: "Watch where the pitch lands, then choose SWING or TAKE.",
    accent: "var(--px-gold)",
  },
  wtp: {
    eyebrow: "BALL IN PLAY",
    title: "DEFENSIVE PLAY!",
    subtitle: "The hitter put it in play. Your defense has to make a decision.",
    accent: "var(--px-teal)",
  },
  "wtp-baserunning": {
    eyebrow: "BALL IN PLAY",
    title: "ON THE BASES!",
    subtitle: "You put the ball in play. Now your runners have a decision to make.",
    accent: "var(--px-teal)",
  },
  "onboard-pitch": {
    eyebrow: "WELCOME TO FULL COUNT",
    title: "HOW TO PITCH",
    subtitle: "Pick a spot in the 3×3 zone. Pick your pitch type. Press THROW IT. The batter card shows you where he's weak — exploit it.",
    accent: "var(--px-red)",
    cta: "GOT IT →",
  },
  "onboard-bat": {
    eyebrow: "ONE MORE THING",
    title: "HOW TO HIT",
    subtitle: "Watch where the pitch lands in the zone grid. SWING if it's a strike worth attacking. TAKE if it's a ball or in a bad spot.",
    accent: "var(--px-gold)",
    cta: "LET'S PLAY →",
  },
};

export default function PhaseIntro({ variant, onDone, autoDismissMs = 6000, blurb }) {
  const [tappable, setTappable] = useState(false);

  useEffect(() => {
    // Avoid accidental dismiss within the first 250ms
    const ready = setTimeout(() => setTappable(true), 250);
    let auto = null;
    if (autoDismissMs) {
      auto = setTimeout(() => onDone?.(), autoDismissMs);
    }
    return () => {
      clearTimeout(ready);
      if (auto) clearTimeout(auto);
    };
  }, [onDone, autoDismissMs]);

  const v = VARIANTS[variant] || VARIANTS.pitching;

  return (
    <div className="phase-intro" onClick={() => tappable && onDone?.()}>
      <div className="phase-intro__card px-box" style={{ borderColor: v.accent }}>
        <div className="phase-intro__eyebrow" style={{ color: v.accent }}>
          {v.eyebrow}
        </div>
        <div className="phase-intro__rule" style={{ background: v.accent }} />
        <h1 className="phase-intro__title" style={{ color: v.accent }}>
          {v.title}
        </h1>
        <p className="phase-intro__subtitle">{v.subtitle}</p>
        {blurb && (
          <div className="phase-intro__blurb">{blurb}</div>
        )}
        <button
          type="button"
          className="phase-intro__continue px-box"
          onClick={(e) => { e.stopPropagation(); if (tappable) onDone?.(); }}
          disabled={!tappable}
          style={{ borderColor: v.accent, color: v.accent }}
        >
          {v.cta || "TAP TO CONTINUE  ▸"}
        </button>
      </div>
    </div>
  );
}
