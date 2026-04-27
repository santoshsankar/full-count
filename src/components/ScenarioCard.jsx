// Used for "Where's The Play" interrupt scenarios

const DIFF_LABELS = {
  rookie:  "ROOKIE",
  pro:     "PRO",
  allstar: "ALL-STAR",
};

const TYPE_LABELS = {
  defense:    "DEFENSE",
  baserunning: "BASERUNNING",
};

export default function ScenarioCard({ scenario }) {
  if (!scenario) return null;
  const { difficulty, type, situation, prompt } = scenario;

  return (
    <div className="scenario-card px-box">
      <div className="scenario-card__header">
        <span className={`scenario-card__badge scenario-card__badge--${difficulty}`}>
          {DIFF_LABELS[difficulty]}
        </span>
        <span className="scenario-card__type">{TYPE_LABELS[type]}</span>
      </div>
      <div className="scenario-card__body">
        <p className="scenario-card__situation">{situation}</p>
        <p className="scenario-card__prompt">{prompt}</p>
      </div>
    </div>
  );
}
