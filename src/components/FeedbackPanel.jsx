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

  const label = isLucky ? "GOT LUCKY" : (VERDICT_LABEL[verdict] || verdict || "GOOD READ");
  const isGood = iqDelta > 0;
  const borderColor = isGood ? "var(--px-green)" : "var(--px-red)";

  return (
    <div
      className={`feedback-panel ${visible ? "feedback-panel--visible" : ""}`}
      style={{ borderTopColor: borderColor }}
    >
      {headline && (
        <div className="feedback-panel__headline">{headline}</div>
      )}

      <div className="feedback-panel__top">
        <span
          className="feedback-panel__verdict"
          style={{ color: isGood ? "var(--px-green)" : "var(--px-red)" }}
        >
          {label}
        </span>
        <span
          className="feedback-panel__iq"
          style={{ color: isGood ? "var(--px-gold)" : "var(--px-red)" }}
        >
          {formatDelta(iqDelta)} IQ
        </span>
      </div>

      {showExplain && (
        <p className="feedback-panel__explain">{explanation}</p>
      )}

      {showExplain && streak >= 2 && (
        <div className="feedback-panel__streak">
          🔥 {streak} IN A ROW
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
