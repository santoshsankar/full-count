import { useEffect, useState } from "react";

export default function FeedbackPanel({ scenario, choiceId, iqDelta, streak, onNext }) {
  const isCorrect = choiceId === scenario.correctAnswerId;
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNext(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const explanation = isCorrect ? scenario.explanationCorrect : scenario.explanationWrong;
  const correctText = scenario.choices.find((c) => c.id === scenario.correctAnswerId)?.text;

  return (
    <div className={`feedback-panel feedback-${isCorrect ? "correct" : "wrong"}`}>
      <div className="feedback-verdict">
        {isCorrect ? (
          <span className="verdict-correct">GOOD READ</span>
        ) : (
          <span className="verdict-wrong">WRONG CALL</span>
        )}
        <span className={`iq-delta ${iqDelta >= 0 ? "delta-pos" : "delta-neg"}`}>
          {iqDelta >= 0 ? "+" : ""}{iqDelta} IQ
        </span>
      </div>

      {!isCorrect && (
        <div className="feedback-correct-answer">
          <span className="correct-label">CORRECT CALL:</span>
          <span className="correct-text">{correctText}</span>
        </div>
      )}

      <p className="feedback-explanation">{explanation}</p>

      {streak >= 3 && isCorrect && (
        <div className="streak-badge">
          🔥 {streak} IN A ROW — +2 IQ BONUS
        </div>
      )}

      <div className={`next-btn-wrap ${showNext ? "next-visible" : ""}`}>
        <button className="btn-next" onClick={onNext}>
          NEXT SCENARIO →
        </button>
      </div>
    </div>
  );
}
