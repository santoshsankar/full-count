import AceSprite from "./AceSprite";

const DIFFICULTIES = [
  { id: "minors",  label: "MINORS",   sub: "Ages 7+",   desc: "Plain English, no jargon" },
  { id: "pro",     label: "PRO",      sub: "Standard",  desc: "Real baseball vocabulary" },
  { id: "allstar", label: "ALL-STAR", sub: "Expert",    desc: "Advanced strategy & leverage" },
];

function MiniBar({ delta }) {
  const pos = delta >= 0;
  return (
    <span className={`mini-bar ${pos ? "mini-bar-pos" : "mini-bar-neg"}`} title={`${pos ? "+" : ""}${delta} IQ`}>
      {pos ? "+" : ""}{delta}
    </span>
  );
}

export default function HomeScreen({ iq, history, difficulty, onDifficultyChange, onStart }) {
  const lastDelta = history.length > 0 ? history[0].delta : null;
  const recent = history.slice(0, 5);

  return (
    <div className="home-screen">
      <div className="home-scanlines" />

      <div className="home-logo-wrap">
        <h1 className="home-logo">FULL COUNT</h1>
        <p className="home-tagline">10 scenarios. Pure baseball IQ.</p>
      </div>

      <div className="home-ace">
        <AceSprite animation="idle" />
      </div>

      <div className="iq-badge-wrap">
        <div className="iq-badge">
          <span className="iq-badge-label">BASEBALL IQ</span>
          <span className="iq-badge-score">{iq}</span>
        </div>
        {lastDelta !== null && (
          <div className={`last-delta ${lastDelta >= 0 ? "delta-pos" : "delta-neg"}`}>
            {lastDelta >= 0 ? "+" : ""}{lastDelta} last run
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <div className="history-strip">
          <span className="history-label">LAST {recent.length}</span>
          <div className="history-bars">
            {recent.map((r, i) => <MiniBar key={i} delta={r.delta} />)}
          </div>
        </div>
      )}

      {/* ── Difficulty picker ── */}
      <div className="diff-picker">
        <div className="diff-picker-label">SELECT DIFFICULTY</div>
        <div className="diff-picker-row">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              className={`diff-btn diff-btn-${d.id} ${difficulty === d.id ? "diff-selected" : ""}`}
              onClick={() => onDifficultyChange(d.id)}
            >
              <span className="diff-btn-label">{d.label}</span>
              <span className="diff-btn-sub">{d.sub}</span>
              <span className="diff-btn-desc">{d.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="btn-cta" onClick={onStart}>
        STEP INTO THE BOX
      </button>

      <footer className="home-footer">
        No stats were harmed in the making of this game.
      </footer>
    </div>
  );
}
