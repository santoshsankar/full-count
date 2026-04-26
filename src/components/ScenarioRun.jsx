import { useState, useEffect, useCallback } from "react";
import ScenarioCard from "./ScenarioCard";
import AnswerChoices from "./AnswerChoices";
import FeedbackPanel from "./FeedbackPanel";
import AceSprite from "./AceSprite";
import { computeIQDelta, applyDelta, buildRunSummary } from "../utils/scoring";

export default function ScenarioRun({ scenarios, startIQ, onComplete }) {
  const [index, setIndex] = useState(0);
  const [iq, setIQ] = useState(startIQ);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [iqDelta, setIQDelta] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [transitioning, setTransitioning] = useState(false);

  const scenario = scenarios[index];
  const isCorrect = selected === scenario?.correctAnswerId;

  const handleSelect = useCallback((choiceId) => {
    setSelected(choiceId);
    const correct = choiceId === scenario.correctAnswerId;
    const newStreak = correct ? streak + 1 : 0;
    const delta = computeIQDelta(scenario, correct, newStreak);
    const newIQ = applyDelta(iq, delta);

    // 600ms pause before reveal
    setTimeout(() => {
      setIQDelta(delta);
      setStreak(newStreak);
      setIQ(newIQ);
      setRevealed(true);
    }, 600);
  }, [scenario, iq, streak]);

  const handleNext = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);

    const newAnswers = [...answers, { choiceId: selected, scenarioId: scenario.id }];
    setAnswers(newAnswers);

    // 400ms card-flip transition
    setTimeout(() => {
      if (index + 1 >= scenarios.length) {
        const summary = buildRunSummary({
          scenarios,
          answers: newAnswers,
          startIQ,
          endIQ: iq,
        });
        onComplete(summary, iq);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
        setRevealed(false);
        setIQDelta(0);
        setTransitioning(false);
      }
    }, 400);
  }, [index, scenarios, selected, answers, iq, startIQ, onComplete, scenario, transitioning]);

  const aceAnim = scenario?.type === "batting" ? "bat" : "pitch";

  return (
    <div className={`scenario-run ${transitioning ? "run-transitioning" : ""}`}>
      {/* Top bar */}
      <div className="run-topbar">
        <div className="run-counter">
          <span className="run-counter-num">{index + 1}</span>
          <span className="run-counter-sep"> of </span>
          <span className="run-counter-num">{scenarios.length}</span>
        </div>
        <div className="run-iq-live">
          <span className="run-iq-label">IQ</span>
          <span className="run-iq-val">{iq}</span>
        </div>
        {streak >= 2 && (
          <div className="streak-flame" title={`${streak} in a row`}>
            🔥 {streak}
          </div>
        )}
      </div>

      {/* Card + Ace row */}
      <div className="run-card-row">
        <div className={`run-card-wrap ${transitioning ? "card-flip-out" : "card-flip-in"}`}>
          <ScenarioCard scenario={scenario} />
        </div>
        {revealed && (
          <div className="run-ace-wrap">
            <AceSprite animation={aceAnim} />
          </div>
        )}
      </div>

      {/* Answers */}
      <AnswerChoices
        choices={scenario.choices}
        selected={selected}
        revealed={revealed}
        correctId={scenario.correctAnswerId}
        onSelect={handleSelect}
      />

      {/* Feedback panel */}
      {revealed && (
        <FeedbackPanel
          scenario={scenario}
          choiceId={selected}
          iqDelta={iqDelta}
          streak={streak}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
