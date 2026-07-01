import { useEffect, useState } from "react";
import { formatDelta } from "../utils/scoring";

const VERDICT_LABEL = {
  GREAT_CALL:   "GREAT CALL",
  GOOD_READ:    "GOOD READ",
  WRONG_CALL:   "WRONG CALL",
  GOT_LUCKY:    "GOT LUCKY",
  // pitching tiers
  EXPLOITS_WEAKNESS:    "GREAT CALL",
  NEUTRAL:              "GOOD READ",
  PITCHING_TO_STRENGTH: "WRONG CALL",
  MISTAKE_PITCH:        "WRONG CALL",
  // batting verdicts
  GREAT_SWING:    "GREAT CALL",
  GOOD_SWING:     "GOOD READ",
  GOOD_TAKE:      "GOOD EYE",
  BAD_TAKE:       "TOOK A STRIKE",
  BAD_SWING:      "BAD SWING",
  TERRIBLE_SWING: "CHASED IT",
};

export default function FeedbackPanel({
  verdict, iqDelta, explanation, streak, onNext, isLucky,
  headline = "", nextLabel = "NEXT —",
  resultLabel,            // explicit override from causal play resolution
  playResult,             // { isOut, throwOutProb, ... } when WTP resolved a play
  score,                  // { home, away } shown alongside playResult
  fielderName,            // shortName of the fielder in the matchup
  runnerName,             // shortName of the runner in the matchup
}) {
  const [showExplain, setShowExplain] = useState(false);
  const [showNext, setShowNext]       = useState(false);
  const [visible, setVisible]         = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setVisible(true), 50);
    const t1 = setTimeout(() => setShowExplain(true), 600);
    const t2 = setTimeout(() => setShowNext(true),    900);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const labelFromVerdict =
    isLucky ? "GOT LUCKY" : (VERDICT_LABEL[verdict] || verdict || "GOOD READ");
  const label = resultLabel || labelFromVerdict;

  const isGood = iqDelta > 0;
  const borderColor = isGood ? "var(--px-green)" : "var(--px-red)";

  const hasMatchup =
    !!playResult &&
    typeof playResult.isOut === "boolean" &&
    fielderName && runnerName;

  return (
    <div
      className={`feedback-panel ${visible ? "feedback-panel--visible" : ""}`}
      style={{ borderLeftColor: borderColor }}
    >
      {headline && (
        <div className="feedback-panel__headline">{headline}</div>
      )}

      <div className="feedback-panel__top">
        <span
          className="feedback-panel__verdict headline-flat"
          style={{ color: isGood ? "var(--px-green)" : "var(--px-red)" }}
        >
          {label}
        </span>
        <span
          className="feedback-panel__iq"
          style={{ color: isGood ? "var(--px-green-dark)" : "var(--px-red)" }}
        >
          {formatDelta(iqDelta)} IQ
        </span>
      </div>

      {hasMatchup && (() => {
        const isBatting = playResult.mode === "batting";
        // From the player's perspective, "success" means the desired outcome:
        // pitching → runner out; batting → runner safe.
        const playerSucceeded = !!playResult.playerSucceeded;
        const goodForPlayer = playerSucceeded;
        const successPct = playResult.successProb ?? playResult.throwOutProb ?? 0;

        let outcomeLabel;
        if (isBatting) {
          outcomeLabel = playResult.isOut
            ? "✗ YOU'RE OUT"
            : playResult.runsScored > 0
              ? `✓ SAFE — ${playResult.runsScored} RUN${playResult.runsScored > 1 ? "S SCORE" : " SCORES"}`
              : "✓ SAFE";
        } else {
          outcomeLabel = playResult.isOut
            ? "✓ RUNNER OUT"
            : playResult.runsScored > 0
              ? `✗ RUN${playResult.runsScored > 1 ? "S" : ""} SCORE${playResult.runsScored > 1 ? "" : "S"}`
              : "✗ RUNNER SAFE";
        }

        const probLine = isBatting
          ? `${playResult.isCorrect ? "Right call" : "Wrong call"}: ${successPct}% safe`
          : `${playResult.isCorrect ? "Right call" : "Wrong call"}: ${successPct}% throw-out`;

        return (
          <div
            className={`feedback-matchup ${goodForPlayer ? "feedback-matchup--out" : "feedback-matchup--safe"}`}
          >
            <div className="feedback-matchup__line1">
              {fielderName} vs {runnerName}
            </div>
            <div className="feedback-matchup__line2">
              {probLine}
            </div>
            <div
              className="feedback-matchup__line3"
              style={{ color: goodForPlayer ? "var(--px-green)" : "var(--px-red)" }}
            >
              {outcomeLabel}
            </div>
          </div>
        );
      })()}

      {showExplain && (
        <p className="feedback-panel__explain">{explanation}</p>
      )}

      {showExplain && streak >= 2 && (
        <div className="feedback-panel__streak">
          🔥 {streak} IN A ROW
        </div>
      )}

      {hasMatchup && score && (
        <div className="feedback-panel__score">
          HOME {score.home} · AWAY {score.away}
        </div>
      )}

      <div className={`feedback-panel__next-wrap ${showNext ? "feedback-panel__next-wrap--visible" : ""}`}>
        <button className="btn-next px-box" onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
