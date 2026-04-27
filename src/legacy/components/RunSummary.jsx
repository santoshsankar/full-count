import { useEffect, useRef, useState } from "react";

function OdometerDigit({ value }) {
  return (
    <span className="odometer-digit" data-val={value}>
      {value}
    </span>
  );
}

function Odometer({ value }) {
  const digits = String(value).split("");
  return (
    <span className="odometer">
      {digits.map((d, i) => (
        <OdometerDigit key={i} value={d} />
      ))}
    </span>
  );
}

export default function RunSummary({ summary, onRunItBack, onHome }) {
  const [step, setStep] = useState(0);
  const maxSteps = 8;

  useEffect(() => {
    if (step >= maxSteps) return;
    const t = setTimeout(() => setStep((s) => s + 1), 300);
    return () => clearTimeout(t);
  }, [step]);

  const shareText = `Full Count · IQ ${summary.endIQ} (${summary.delta >= 0 ? "+" : ""}${summary.delta}) · ${summary.correctCount}/${summary.total} · ${summary.runsImpact >= 0 ? "+" : ""}${summary.runsImpact} runs · fullcount.app`;

  function copyShare() {
    navigator.clipboard.writeText(shareText).catch(() => {});
  }

  return (
    <div className="run-summary">
      {step >= 1 && (
        <div className="summary-header animate-in">
          <div className="summary-title">FINAL</div>
          <div className="summary-subtitle">RUN COMPLETE</div>
        </div>
      )}

      {step >= 2 && (
        <div className="summary-iq animate-in">
          <div className="summary-iq-label">BASEBALL IQ</div>
          <div className="summary-iq-score">
            <Odometer value={summary.endIQ} />
          </div>
        </div>
      )}

      {step >= 3 && (
        <div className="summary-delta animate-in">
          <span className={`delta-badge ${summary.delta >= 0 ? "delta-pos" : "delta-neg"}`}>
            {summary.delta >= 0 ? "+" : ""}{summary.delta} THIS RUN
          </span>
        </div>
      )}

      {step >= 4 && (
        <div className="summary-stat-row animate-in">
          <div className="summary-stat">
            <div className="summary-stat-label">CORRECT</div>
            <div className="summary-stat-val">{summary.correctCount} for {summary.total}</div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat-label">RUNS IMPACT</div>
            <div className="summary-stat-val">
              {summary.runsImpact >= 0 ? "+" : ""}{summary.runsImpact}
            </div>
          </div>
        </div>
      )}

      {step >= 5 && summary.bestDecision && (
        <div className="summary-decision summary-best animate-in">
          <div className="decision-label">BEST DECISION</div>
          <div className="decision-scenario">
            {summary.bestDecision.scenario.prompt.slice(0, 80)}…
          </div>
          <div className="decision-impact">+{summary.bestDecision.impact.toFixed(1)} runs</div>
        </div>
      )}

      {step >= 6 && summary.worstDecision && (
        <div className="summary-decision summary-worst animate-in">
          <div className="decision-label">WORST DECISION</div>
          <div className="decision-scenario">
            {summary.worstDecision.scenario.prompt.slice(0, 80)}…
          </div>
          <div className="decision-impact">{summary.worstDecision.impact.toFixed(1)} runs</div>
        </div>
      )}

      {step >= 7 && (
        <div className="summary-share animate-in">
          <div className="share-text">{shareText}</div>
          <button className="btn-share" onClick={copyShare}>COPY TO CLIPBOARD</button>
        </div>
      )}

      {step >= 8 && (
        <div className="summary-actions animate-in">
          <button className="btn-primary" onClick={onRunItBack}>RUN IT BACK</button>
          <button className="btn-secondary" onClick={onHome}>HOME</button>
        </div>
      )}
    </div>
  );
}
