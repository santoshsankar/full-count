import { useEffect, useRef } from "react";

// Color palette — 5 colors, sprite-sheet style
const C = {
  skin: "#f0c07a",
  navy: "#0d1f3c",
  white: "#f5f0e8",
  red: "#c41230",
  shadow: "#1a0a00",
};

export default function AceSprite({ animation = "idle" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-anim", animation);
  }, [animation]);

  return (
    <div className="ace-sprite-wrap" ref={ref} data-anim={animation}>
      <svg
        viewBox="0 0 120 160"
        width="120"
        height="160"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="The Ace — fictional pitcher mascot"
        className={`ace-svg ace-${animation}`}
      >
        {/* ── Shadow ── */}
        <ellipse cx="60" cy="155" rx="28" ry="5" fill="rgba(0,0,0,0.25)" />

        {/* ── Body group — idles with weight shift ── */}
        <g className="ace-body">
          {/* Legs / pants */}
          <rect x="42" y="100" width="16" height="40" rx="2" fill={C.white} stroke={C.shadow} strokeWidth="3" />
          <rect x="62" y="100" width="16" height="40" rx="2" fill={C.white} stroke={C.shadow} strokeWidth="3" />
          {/* Cleats */}
          <rect x="39" y="136" width="22" height="8" rx="2" fill={C.shadow} />
          <rect x="59" y="136" width="22" height="8" rx="2" fill={C.shadow} />

          {/* Jersey — navy */}
          <rect x="36" y="62" width="48" height="44" rx="3" fill={C.navy} stroke={C.shadow} strokeWidth="3" />

          {/* Belt */}
          <rect x="36" y="98" width="48" height="6" rx="1" fill={C.red} />

          {/* Glove arm — left side (fielding) */}
          <g className="ace-glove-arm">
            <rect x="16" y="66" width="24" height="12" rx="4" fill={C.navy} stroke={C.shadow} strokeWidth="3" />
            {/* Glove */}
            <ellipse cx="14" cy="72" rx="10" ry="8" fill={C.red} stroke={C.shadow} strokeWidth="3" />
            <ellipse cx="14" cy="72" rx="6" ry="5" fill="#8b0000" />
          </g>

          {/* Throwing arm — right side */}
          <g className="ace-throw-arm">
            <rect x="80" y="66" width="24" height="12" rx="4" fill={C.navy} stroke={C.shadow} strokeWidth="3" />
            {/* Hand / ball */}
            <circle cx="108" cy="72" r="7" fill={C.skin} stroke={C.shadow} strokeWidth="2.5" />
            <circle cx="108" cy="72" r="4" fill={C.white} stroke={C.shadow} strokeWidth="1.5" />
            <path d="M105 70 Q108 68 111 70" stroke={C.red} strokeWidth="1" fill="none" />
          </g>

          {/* Head */}
          <g className="ace-head">
            {/* Cap */}
            <ellipse cx="60" cy="34" rx="22" ry="8" fill={C.navy} stroke={C.shadow} strokeWidth="3" />
            <rect x="38" y="28" width="44" height="16" rx="8" fill={C.navy} stroke={C.shadow} strokeWidth="3" />
            {/* Brim */}
            <path d="M38 38 Q40 44 26 44" stroke={C.shadow} strokeWidth="3" fill={C.navy} />
            {/* Face */}
            <ellipse cx="60" cy="52" rx="16" ry="14" fill={C.skin} stroke={C.shadow} strokeWidth="3" />
            {/* Eyes */}
            <circle cx="54" cy="50" r="2.5" fill={C.shadow} />
            <circle cx="66" cy="50" r="2.5" fill={C.shadow} />
            <circle cx="55" cy="49" r="1" fill={C.white} />
            <circle cx="67" cy="49" r="1" fill={C.white} />
            {/* Jaw / chin line */}
            <path d="M50 58 Q60 64 70 58" stroke={C.shadow} strokeWidth="1.5" fill="none" />
          </g>

          {/* Leg kick group — only visible during pitch anim */}
          <g className="ace-kick-leg">
            <rect x="42" y="100" width="16" height="40" rx="2" fill={C.white} stroke={C.shadow} strokeWidth="3" />
            <rect x="39" y="136" width="22" height="8" rx="2" fill={C.shadow} />
          </g>
        </g>
      </svg>
    </div>
  );
}
