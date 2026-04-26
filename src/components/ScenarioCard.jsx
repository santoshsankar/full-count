import FieldDiagram from "./FieldDiagram";

const TYPE_LABELS = {
  pitching: "PITCHING",
  batting: "BATTING",
  defense: "DEFENSE",
  baserunning: "BASERUNNING",
};

const DIFF_LABELS = {
  rookie: "ROOKIE",
  pro: "PRO",
  allstar: "ALL-STAR",
};


function countLabel(balls, strikes) {
  return `${balls}-${strikes}`;
}

function inningLabel(inning, half) {
  const arrow = half === "top" ? "▲" : "▼";
  return `${arrow} ${inning}`;
}

function outsLabel(outs) {
  return outs === 1 ? "1 OUT" : outs === 2 ? "2 OUTS" : "0 OUTS";
}

function scoreLabel(score) {
  return `HOME ${score.home} · AWAY ${score.away}`;
}

export default function ScenarioCard({ scenario }) {
  const { situation, archetypes, prompt, difficulty, type } = scenario;

  return (
    <div className="scenario-card">
      {/* Card header — foil gradient */}
      <div className="card-header">
        <span className={`badge badge-diff badge-diff-${difficulty}`}>
          {DIFF_LABELS[difficulty]}
        </span>
        <span className="badge badge-type">{TYPE_LABELS[type]}</span>
      </div>

      {/* Card body — cream stock */}
      <div className="card-body">
        {/* Field diagram + situation */}
        <div className="card-situation-row">
          <FieldDiagram runners={situation.runners} />

          <div className="card-situation-stats">
            <div className="stat-line">
              <span className="stat-label">INN</span>
              <span className="stat-val">{inningLabel(situation.inning, situation.half)}</span>
            </div>
            <div className="stat-line">
              <span className="stat-label">OUTS</span>
              <span className="stat-val">{outsLabel(situation.outs)}</span>
            </div>
            <div className="stat-line">
              <span className="stat-label">COUNT</span>
              <span className="stat-val">{countLabel(situation.count.balls, situation.count.strikes)}</span>
            </div>
            <div className="stat-line">
              <span className="stat-label">SCORE</span>
              <span className="stat-val">{scoreLabel(situation.score)}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-line">
              <span className="stat-label">BAT</span>
              <span className="stat-val archetype">{archetypes.batter}</span>
            </div>
            <div className="stat-line">
              <span className="stat-label">PIT</span>
              <span className="stat-val archetype">{archetypes.pitcher}</span>
            </div>
            {archetypes.runner && (
              <div className="stat-line">
                <span className="stat-label">RUN</span>
                <span className="stat-val archetype">{archetypes.runner}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prompt */}
        <div className="card-prompt">
          <p>{prompt}</p>
        </div>
      </div>
    </div>
  );
}
