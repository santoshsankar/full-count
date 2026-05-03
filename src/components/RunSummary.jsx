import { useEffect, useState } from "react";
import { formatDelta } from "../utils/scoring";

function OdometerCount({ target, start }) {
  const [val, setVal] = useState(start);

  useEffect(() => {
    if (val === target) return;
    const step = target > val ? 1 : -1;
    const speed = Math.max(20, Math.floor(800 / Math.abs(target - start)));
    const t = setTimeout(() => setVal(v => v + step), speed);
    return () => clearTimeout(t);
  }, [val, target, start]);

  return <span className="odometer-val">{val}</span>;
}

export default function RunSummary({ runData, onRunItBack, onHome }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [0, 300, 600, 900, 1200, 1500, 1800].map(
      (ms, i) => setTimeout(() => setStep(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!runData) return null;

  const {
    seed,
    iqStart, iqEnd, iqDelta,
    correct, total,
    runsImpact,
    finalScore,
    bestDecision, worstDecision,
  } = runData;

  const runCode = (seed % 9000 + 1000).toString().padStart(4, "0");

  const shareText =
    `Full Count · Run #${runCode} · IQ ${iqEnd} (${formatDelta(iqDelta)}) · ` +
    `${correct}/${total} decisions · ${runsImpact > 0 ? "+" : ""}${runsImpact.toFixed(1)} runs · ` +
    `Can you beat it?`;

  function handleCopy() {
    navigator.clipboard.writeText(shareText).catch(() => {});
  }

  return (
    <div className="run-summary">
      {/* 1 — Header */}
      <div className={`summary-section ${step >= 1 ? "summary-section--in" : ""}`}>
        <div className="summary-header">
          <span className="summary-header__rule" />
          <h2 className="summary-title">FINAL</h2>
          <span className="summary-header__rule" />
        </div>
      </div>

      {/* 2 — IQ Odometer */}
      <div className={`summary-section ${step >= 2 ? "summary-section--in" : ""}`}>
        <div className="summary-iq">
          <div className="summary-iq__label">BASEBALL IQ</div>
          <div className="summary-iq__score">
            {step >= 2
              ? <OdometerCount target={iqEnd} start={iqStart} />
              : <span className="odometer-val">{iqStart}</span>
            }
          </div>
        </div>
      </div>

      {/* 3 — Delta */}
      <div className={`summary-section ${step >= 3 ? "summary-section--in" : ""}`}>
        <div
          className="summary-delta"
          style={{ color: iqDelta >= 0 ? "var(--px-green)" : "var(--px-red)" }}
        >
          {formatDelta(iqDelta)} THIS RUN
        </div>
      </div>

      {/* 4 — Correct count */}
      <div className={`summary-section ${step >= 4 ? "summary-section--in" : ""}`}>
        <div className="summary-record">
          {correct} FOR {total}
        </div>
        <div className="summary-runs" style={{ color: runsImpact >= 0 ? "var(--px-teal)" : "var(--px-red)" }}>
          {runsImpact >= 0 ? "+" : ""}{runsImpact.toFixed(1)} RUNS {runsImpact >= 0 ? "SAVED" : "COST"}
        </div>
        {finalScore && (
          <div className="summary-scoreboard">
            <div className={`summary-scoreboard__row ${finalScore.home > finalScore.away ? "summary-scoreboard__row--win" : ""}`}>
              <span className="summary-scoreboard__label">HOME</span>
              <span className="summary-scoreboard__num">{finalScore.home}</span>
            </div>
            <div className={`summary-scoreboard__row ${finalScore.away > finalScore.home ? "summary-scoreboard__row--win" : ""}`}>
              <span className="summary-scoreboard__label">AWAY</span>
              <span className="summary-scoreboard__num">{finalScore.away}</span>
            </div>
            <div className="summary-scoreboard__verdict">
              {finalScore.home > finalScore.away
                ? "FINAL — HOME WINS"
                : finalScore.away > finalScore.home
                  ? "FINAL — AWAY WINS"
                  : "FINAL — TIED"}
            </div>
          </div>
        )}
      </div>

      {/* 5 — Best decision */}
      {bestDecision && (
        <div className={`summary-section ${step >= 5 ? "summary-section--in" : ""}`}>
          <div className="summary-decision summary-decision--best">
            <div className="summary-decision__label">BEST CALL</div>
            <div className="summary-decision__text">
              {bestDecision.scenarioText || bestDecision.explanation || "Great pitch selection"}
            </div>
            <div className="summary-decision__delta" style={{ color: "var(--px-green)" }}>
              {formatDelta(bestDecision.iqDelta)} IQ
            </div>
          </div>
        </div>
      )}

      {/* 6 — Worst decision */}
      {worstDecision && (
        <div className={`summary-section ${step >= 6 ? "summary-section--in" : ""}`}>
          <div className="summary-decision summary-decision--worst">
            <div className="summary-decision__label">WORST CALL</div>
            <div className="summary-decision__text">
              {worstDecision.scenarioText || worstDecision.explanation || "Pitch to their strength"}
            </div>
            <div className="summary-decision__delta" style={{ color: "var(--px-red)" }}>
              {formatDelta(worstDecision.iqDelta)} IQ
            </div>
          </div>
        </div>
      )}

      {/* 7 — Share + run code */}
      <div className={`summary-section ${step >= 7 ? "summary-section--in" : ""}`}>
        <div className="summary-share px-box">
          <div className="summary-run-code">RUN #{runCode}</div>
          <p className="summary-share__text">{shareText}</p>
          <button className="btn-share" onClick={handleCopy}>
            COPY & CHALLENGE
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className={`summary-actions ${step >= 7 ? "summary-section--in" : ""}`}>
        <button className="btn-primary px-box" onClick={onRunItBack}>
          RUN IT BACK
        </button>
        <button className="btn-secondary" onClick={onHome}>
          HOME
        </button>
      </div>
    </div>
  );
}
