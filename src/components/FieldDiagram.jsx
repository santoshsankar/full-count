const BASE_DEFAULT = "#f5f0e8";
const BASE_OCCUPIED = "#f5c842";
const BASE_STROKE = "#0d1f3c";
const DIRT = "#8b6914";
const GRASS = "#2d5a27";
const LINE_COLOR = "#f5f0e8";

export default function FieldDiagram({ runners = { first: false, second: false, third: false } }) {
  return (
    <svg
      viewBox="0 0 160 160"
      width="160"
      height="160"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Baseball field diagram"
      style={{ display: "block" }}
    >
      {/* Outfield grass */}
      <rect x="0" y="0" width="160" height="160" fill={GRASS} />

      {/* Infield dirt diamond */}
      <polygon
        points="80,20 148,88 80,148 12,88"
        fill={DIRT}
        opacity="0.85"
      />

      {/* Foul lines */}
      <line x1="80" y1="148" x2="0" y2="60" stroke={LINE_COLOR} strokeWidth="1" opacity="0.4" />
      <line x1="80" y1="148" x2="160" y2="60" stroke={LINE_COLOR} strokeWidth="1" opacity="0.4" />

      {/* Pitcher's mound */}
      <circle cx="80" cy="100" r="10" fill={DIRT} stroke="#6b4f10" strokeWidth="1.5" />
      <circle cx="80" cy="100" r="4" fill="#a07820" />

      {/* Base paths (subtle lines) */}
      <line x1="80" y1="148" x2="148" y2="88" stroke={LINE_COLOR} strokeWidth="1" opacity="0.3" />
      <line x1="148" y1="88" x2="80" y2="20" stroke={LINE_COLOR} strokeWidth="1" opacity="0.3" />
      <line x1="80" y1="20" x2="12" y2="88" stroke={LINE_COLOR} strokeWidth="1" opacity="0.3" />
      <line x1="12" y1="88" x2="80" y2="148" stroke={LINE_COLOR} strokeWidth="1" opacity="0.3" />

      {/* Home plate */}
      <polygon
        points="80,152 73,144 73,137 87,137 87,144"
        fill={BASE_DEFAULT}
        stroke={BASE_STROKE}
        strokeWidth="2"
      />

      {/* First base (right) */}
      <rect
        x="138"
        y="80"
        width="16"
        height="16"
        rx="2"
        fill={runners.first ? BASE_OCCUPIED : BASE_DEFAULT}
        stroke={BASE_STROKE}
        strokeWidth="2"
        className={runners.first ? "base-occupied" : ""}
        style={{ transition: "fill 300ms ease-in" }}
      />

      {/* Second base (top) */}
      <rect
        x="72"
        y="12"
        width="16"
        height="16"
        rx="2"
        fill={runners.second ? BASE_OCCUPIED : BASE_DEFAULT}
        stroke={BASE_STROKE}
        strokeWidth="2"
        className={runners.second ? "base-occupied" : ""}
        style={{ transition: "fill 300ms ease-in" }}
      />

      {/* Third base (left) */}
      <rect
        x="6"
        y="80"
        width="16"
        height="16"
        rx="2"
        fill={runners.third ? BASE_OCCUPIED : BASE_DEFAULT}
        stroke={BASE_STROKE}
        strokeWidth="2"
        className={runners.third ? "base-occupied" : ""}
        style={{ transition: "fill 300ms ease-in" }}
      />

      {/* Runner dots */}
      {runners.first && (
        <circle cx="146" cy="72" r="5" fill={BASE_OCCUPIED} stroke={BASE_STROKE} strokeWidth="1.5"
          style={{ animation: "runnerAppear 300ms ease-in" }} />
      )}
      {runners.second && (
        <circle cx="80" cy="10" r="5" fill={BASE_OCCUPIED} stroke={BASE_STROKE} strokeWidth="1.5"
          style={{ animation: "runnerAppear 300ms ease-in" }} />
      )}
      {runners.third && (
        <circle cx="14" cy="72" r="5" fill={BASE_OCCUPIED} stroke={BASE_STROKE} strokeWidth="1.5"
          style={{ animation: "runnerAppear 300ms ease-in" }} />
      )}
    </svg>
  );
}
