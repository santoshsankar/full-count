import AceSprite from "./AceSprite";
import { formatDelta } from "../utils/scoring";

function MiniBar({ delta }) {
  const h = Math.max(4, Math.min(32, Math.abs(delta) * 3));
  return (
    <div
      className="mini-bar"
      style={{
        height: h,
        background: delta >= 0 ? "var(--px-gold)" : "var(--px-red)",
      }}
      title={`${formatDelta(delta)} IQ`}
    />
  );
}

// Minimal isometric stadium SVG for background
function StadiumBG() {
  return (
    <svg
      className="home-stadium-bg"
      viewBox="0 0 480 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* night sky */}
      <rect width="480" height="700" fill="var(--px-navy)" />

      {/* outfield wall */}
      <polygon points="40,320 440,320 460,380 20,380" fill="var(--px-navy-left)" />

      {/* stands left */}
      <polygon points="20,200 160,200 120,320 20,320" fill="var(--px-navy-mid)" />
      {/* stands right */}
      <polygon points="460,200 320,200 360,320 460,320" fill="var(--px-navy-mid)" />

      {/* foul pole left */}
      <rect x="60" y="140" width="3" height="180" fill="var(--px-gold)" opacity="0.8" />
      {/* foul pole right */}
      <rect x="417" y="140" width="3" height="180" fill="var(--px-gold)" opacity="0.8" />

      {/* scoreboard */}
      <rect x="180" y="120" width="120" height="70" fill="#0a0a14" />
      <rect x="184" y="124" width="112" height="62" fill="#0a0a14" stroke="var(--px-gold)" strokeWidth="2" />

      {/* "FULL COUNT" pixel text on scoreboard — dot matrix */}
      {[
        /* F */
        [0,0],[0,1],[0,2],[0,3],[1,0],[2,0],[1,2],[2,2],
        /* U */
        [4,0],[4,1],[4,2],[4,3],[5,3],[6,3],[6,0],[6,1],[6,2],
        /* L */
        [8,0],[8,1],[8,2],[8,3],[9,3],[10,3],
        /* L */
        [12,0],[12,1],[12,2],[12,3],[13,3],[14,3],
      ].map(([cx, cy], i) => (
        <rect
          key={i}
          x={190 + cx * 4}
          y={130 + cy * 4}
          width="3"
          height="3"
          fill="var(--px-gold)"
        />
      ))}

      {/* field grass */}
      <polygon points="40,380 440,380 400,480 80,480" fill="var(--px-grass)" opacity="0.6" />
      {/* infield dirt */}
      <polygon points="200,400 280,380 360,420 300,470 200,470 140,420" fill="var(--px-dirt)" opacity="0.5" />

      {/* stadium lights halo */}
      <radialGradient id="lightL" cx="15%" cy="15%" r="30%">
        <stop offset="0%"  stopColor="var(--px-gold)" stopOpacity="0.12" />
        <stop offset="100%" stopColor="transparent"   stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lightR" cx="85%" cy="15%" r="30%">
        <stop offset="0%"  stopColor="var(--px-gold)" stopOpacity="0.12" />
        <stop offset="100%" stopColor="transparent"   stopOpacity="0" />
      </radialGradient>
      <rect width="480" height="700" fill="url(#lightL)" />
      <rect width="480" height="700" fill="url(#lightR)" />
    </svg>
  );
}

const DIFFICULTIES = [
  { value: "rookie",  label: "ROOKIE"   },
  { value: "pro",     label: "PRO"      },
  { value: "allstar", label: "ALL-STAR" },
];

export default function HomeScreen({
  iq,
  history,
  onStart,
  currentDifficulty = "pro",
  onDifficultyChange,
}) {
  const lastRun  = history[0];
  const lastDelta = lastRun ? lastRun.iqDelta : null;
  const miniHistory = history.slice(0, 5);

  return (
    <div className="home-screen scanlines crt-vignette">
      <StadiumBG />

      <div className="home-content">
        <div className="home-logo-wrap">
          <h1 className="home-logo">FULL COUNT</h1>
          <p className="home-tagline">10 SCENARIOS. PURE BASEBALL IQ.</p>
        </div>

        <div className="home-ace">
          <AceSprite animation="idle" size={120} />
        </div>

        {/* IQ badge */}
        <div className="home-iq-wrap">
          <div className="iq-badge px-box">
            <span className="iq-badge__label">BASEBALL IQ</span>
            <span className="iq-badge__score">{iq}</span>
            {lastDelta !== null && (
              <span
                className="iq-badge__delta"
                style={{ color: lastDelta >= 0 ? "var(--px-teal)" : "var(--px-red)" }}
              >
                {formatDelta(lastDelta)} LAST RUN
              </span>
            )}
          </div>

          {miniHistory.length > 0 && (
            <div className="home-history">
              <span className="home-history__label">RECENT</span>
              <div className="home-history__bars">
                {miniHistory.map((run, i) => (
                  <MiniBar key={i} delta={run.iqDelta} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="home-difficulty" role="radiogroup" aria-label="Difficulty">
          <span className="home-difficulty__label">DIFFICULTY</span>
          <div className="home-difficulty__row">
            {DIFFICULTIES.map(({ value, label }) => {
              const selected = currentDifficulty === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`home-difficulty__btn ${selected ? "home-difficulty__btn--selected px-box" : "px-box-inset"}`}
                  onClick={() => onDifficultyChange && onDifficultyChange(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <button className="btn-cta px-box" onClick={onStart}>
          STEP INTO THE BOX
        </button>

        <footer className="home-footer">
          No stats were harmed in the making of this game.
        </footer>
      </div>
    </div>
  );
}
