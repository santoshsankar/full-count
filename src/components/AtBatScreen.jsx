import { useState, useCallback, useEffect, useRef } from "react";
import FieldDiagram  from "./FieldDiagram";
import BatterCard    from "./BatterCard";
import PitcherCard   from "./PitcherCard";
import PitchZoneGrid from "./PitchZoneGrid";
import AceSprite     from "./AceSprite";
import FeedbackPanel from "./FeedbackPanel";
import ScenarioCard  from "./ScenarioCard";
import AnswerChoices from "./AnswerChoices";
import CountDisplay  from "./CountDisplay";
import IQDisplay     from "./IQDisplay";
import { batters  }  from "../data/batters";
import { pitchers }  from "../data/pitchers";
import { whereIsThePlay } from "../data/whereIsThePlay";
import {
  SeededRNG, resolvePitch, getCPUPitch, getBattingIQDelta,
  resolveContact, advanceRunners, pickArchetypes, getMatchupTier,
} from "../utils/simEngine";
import { applyIQDelta, getStreakBonus } from "../utils/scoring";

const AT_BATS = 6; // 3 pitching + 3 batting, alternating

// Pick a WTP scenario appropriate for the current difficulty
function pickWTP(rng, difficulty) {
  const pool = whereIsThePlay.filter(s => s.difficulty === difficulty);
  return rng.pick(pool.length ? pool : whereIsThePlay);
}

function getCountState(count) {
  const { balls, strikes } = count;
  if (strikes > balls) return "ahead";
  if (balls > strikes) return "behind";
  return "even";
}

export default function AtBatScreen({ onComplete, initialIQ, difficulty = "pro" }) {
  const seedRef = useRef(Date.now() % 100000);
  const rngRef  = useRef(new SeededRNG(seedRef.current));

  // Run-level character assignments (stable for the whole run)
  const [runBatters]  = useState(() => pickArchetypes(batters,  AT_BATS, rngRef.current));
  const [runPitchers] = useState(() => pickArchetypes(pitchers, AT_BATS, rngRef.current));

  // ── Run progress ──
  const [atBatIndex, setAtBatIndex] = useState(0);
  const [iq,         setIQ]         = useState(initialIQ);
  const [streak,     setStreak]     = useState(0);
  const [allResults, setAllResults] = useState([]); // [{iqDelta, verdict, explanation, ...}]
  const [iqFlash,    setIQFlash]    = useState(null);

  // ── At-bat state ──
  const [count,    setCount]   = useState({ balls: 0, strikes: 0 });
  const [outs,     setOuts]    = useState(0);
  const [runners,  setRunners] = useState({ first: false, second: false, third: false });
  const [score,    setScore]   = useState({ home: 0, away: 0 });
  const [pitchHist,setPitchHist]= useState([]);

  // ── UI phase ──
  const [phase, setPhase] = useState("selecting"); // selecting|animating|feedback|wtp|between|done
  const [aceAnim,setAceAnim] = useState("idle");

  // ── Pitching mode ──
  const [selZone,  setSelZone]  = useState(null);
  const [selPitch, setSelPitch] = useState(null);

  // ── Batting mode ──
  const [incomingPitch, setIncomingPitch] = useState(null); // {pitch, location}
  const [showZone,      setShowZone]      = useState(false);
  const [battingReady,  setBattingReady]  = useState(false);

  // ── Result + WTP ──
  const [lastResult, setLastResult]   = useState(null);
  const [wtpScenario, setWTPScenario] = useState(null);
  const [wtpSelected, setWTPSelected] = useState(null);
  const [wtpRevealed, setWTPRevealed] = useState(false);
  const [wtpResult,   setWTPResult]   = useState(null);
  const [lastIQDelta, setLastIQDelta] = useState(0);

  const mode          = atBatIndex % 2 === 0 ? "pitching" : "batting";
  const currentBatter = runBatters[atBatIndex]  || batters[0];
  const currentPitcher= runPitchers[atBatIndex] || pitchers[0];

  // ── Helpers ──
  function flashIQ(dir) {
    setIQFlash(dir);
    setTimeout(() => setIQFlash(null), 400);
  }

  function applyResult(result) {
    const { iqDelta, matchupTier, explanation, isLucky, isMistake } = result;

    const bonus = getStreakBonus(streak);
    const finalDelta = iqDelta + (iqDelta > 0 ? bonus : 0);
    const newIQ   = applyIQDelta(iq, finalDelta);
    const newStreak = iqDelta > 0 ? streak + 1 : 0;

    setIQ(newIQ);
    setStreak(newStreak);
    setLastIQDelta(finalDelta);
    flashIQ(finalDelta >= 0 ? "pos" : "neg");

    setAllResults(prev => [...prev, {
      iqDelta: finalDelta,
      verdict: matchupTier,
      explanation,
      scenarioText: `${selPitch || incomingPitch?.pitch || ""} — ${currentBatter?.shortName}`,
      isLucky,
    }]);

    return { newIQ, newStreak };
  }

  function updateCount(outcome) {
    let { balls, strikes } = count;
    let atBatOver = false;
    let contactType = null;

    if (outcome === "ball") {
      balls++;
      if (balls >= 4) { atBatOver = true; contactType = "walk"; }
    } else if (outcome === "whiff") {
      strikes++;
      if (strikes >= 3) { atBatOver = true; contactType = "strikeout"; }
    } else if (outcome === "foul") {
      if (strikes < 2) strikes++;
    } else if (outcome === "weak_contact" || outcome === "hard_contact") {
      atBatOver = true;
      contactType = outcome;
    } else if (outcome === "called_strike") {
      strikes++;
      if (strikes >= 3) { atBatOver = true; contactType = "strikeout"; }
    }

    setCount({ balls, strikes });
    return { atBatOver, contactType };
  }

  // ── Pitching mode: player throws ──
  function handleThrow() {
    if (!selZone || !selPitch || phase !== "selecting") return;

    setPhase("animating");
    setAceAnim("pitch");

    const result = resolvePitch(
      selPitch, selZone, currentBatter,
      count, pitchHist, rngRef.current
    );

    setPitchHist(prev => [...prev, { pitch: selPitch, location: selZone }]);

    setTimeout(() => {
      setAceAnim("idle");
      applyResult(result);
      setLastResult(result);

      const { atBatOver, contactType } = updateCount(result.outcome);

      if (atBatOver && (contactType === "weak_contact" || contactType === "hard_contact")) {
        // Show WTP interrupt
        const wtp = pickWTP(rngRef.current, difficulty);
        setWTPScenario(wtp);
        setWTPSelected(null);
        setWTPRevealed(false);
        setWTPResult(null);
        setPhase("wtp");
      } else if (atBatOver) {
        // Strike out or walk — resolve at-bat
        resolveAtBatEnd(contactType, result);
        setPhase("feedback");
      } else {
        setPhase("feedback");
      }
    }, 800);
  }

  // ── Batting mode: show incoming pitch ──
  function startBattingPitch() {
    const incoming = getCPUPitch(currentPitcher, count, rngRef.current);
    setIncomingPitch(incoming);
    setShowZone(true);
    setBattingReady(false);

    setTimeout(() => {
      setShowZone(false);
      setBattingReady(true);
    }, 800);
  }

  useEffect(() => {
    if (mode === "batting" && phase === "selecting" && !incomingPitch) {
      startBattingPitch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, phase, atBatIndex]);

  // ── Batting mode: player swings or takes ──
  function handleBatDecision(decision) {
    if (!battingReady || !incomingPitch || phase !== "selecting") return;

    setPhase("animating");
    setAceAnim(decision === "swing" ? "bat" : "idle");

    const { pitch, location } = incomingPitch;
    const iqInfo = getBattingIQDelta(decision, location, currentPitcher, count);

    const simResult = resolvePitch(
      pitch, location, currentBatter,
      count, pitchHist, rngRef.current
    );

    const combinedResult = {
      ...simResult,
      iqDelta:     iqInfo.delta,
      matchupTier: iqInfo.verdict,
      isLucky:     false,
    };

    setPitchHist(prev => [...prev, { pitch, location }]);

    setTimeout(() => {
      setAceAnim("idle");
      applyResult(combinedResult);
      setLastResult(combinedResult);

      const { atBatOver, contactType } = updateCount(simResult.outcome);

      if (atBatOver && (contactType === "weak_contact" || contactType === "hard_contact")) {
        const wtp = pickWTP(rngRef.current, difficulty);
        setWTPScenario(wtp);
        setWTPSelected(null);
        setWTPRevealed(false);
        setWTPResult(null);
        setPhase("wtp");
      } else if (atBatOver) {
        resolveAtBatEnd(contactType, simResult);
        setPhase("feedback");
      } else {
        setPhase("feedback");
        setIncomingPitch(null);
        setBattingReady(false);
      }
    }, 600);
  }

  // ── WTP answer ──
  function handleWTPSelect(choiceId) {
    if (wtpSelected) return;
    setWTPSelected(choiceId);

    const isCorrect = choiceId === wtpScenario.correctAnswerId;
    const iqDelta   = isCorrect ? wtpScenario.iqDeltaCorrect : wtpScenario.iqDeltaWrong;
    const newIQ     = applyIQDelta(iq, iqDelta);
    const newStreak = iqDelta > 0 ? streak + 1 : 0;

    setIQ(newIQ);
    setStreak(newStreak);
    setLastIQDelta(iqDelta);
    flashIQ(iqDelta >= 0 ? "pos" : "neg");
    setWTPResult({
      iqDelta, isCorrect,
      explanation: isCorrect
        ? wtpScenario.explanationCorrect
        : wtpScenario.explanationWrong,
      verdict: isCorrect ? "GREAT_CALL" : "WRONG_CALL",
    });
    setAllResults(prev => [...prev, {
      iqDelta,
      verdict: isCorrect ? "EXPLOITS_WEAKNESS" : "PITCHING_TO_STRENGTH",
      explanation: isCorrect ? wtpScenario.explanationCorrect : wtpScenario.explanationWrong,
      scenarioText: wtpScenario.situation.substring(0, 60) + "…",
    }]);

    setTimeout(() => setWTPRevealed(true), 50);
  }

  function handleWTPNext() {
    // After WTP, resolve the contact play
    resolveAtBatEnd(lastResult?.outcome === "hard_contact" ? "hard_contact" : "weak_contact", lastResult);
    setPhase("feedback");
    setWTPScenario(null);
  }

  function resolveAtBatEnd(contactType, result) {
    if (contactType === "strikeout") {
      const newOuts = outs + 1;
      setOuts(newOuts);
      checkInningEnd(newOuts);
      return;
    }
    if (contactType === "walk") {
      const { runners: newRunners, runsScored } = advanceRunners(runners, "walk");
      setRunners(newRunners);
      updateScore(runsScored);
      return;
    }
    if (contactType === "weak_contact" || contactType === "hard_contact") {
      const playResult = resolveContact(contactType, rngRef.current);
      if (playResult === "out") {
        const newOuts = outs + 1;
        setOuts(newOuts);
        checkInningEnd(newOuts);
      } else {
        const { runners: newRunners, runsScored } = advanceRunners(runners, playResult);
        setRunners(newRunners);
        updateScore(runsScored);
      }
    }
  }

  function updateScore(runsScored) {
    if (runsScored <= 0) return;
    if (mode === "batting") {
      setScore(s => ({ ...s, home: s.home + runsScored }));
    } else {
      setScore(s => ({ ...s, away: s.away + runsScored }));
    }
  }

  function checkInningEnd(newOuts) {
    if (newOuts >= 3) {
      setOuts(0);
      setRunners({ first: false, second: false, third: false });
    }
  }

  // ── Next pitch / next at-bat ──
  function handleNext() {
    const nextAB = atBatIndex + 1;

    // Reset at-bat state
    setCount({ balls: 0, strikes: 0 });
    setPitchHist([]);
    setSelZone(null);
    setSelPitch(null);
    setLastResult(null);
    setIncomingPitch(null);
    setBattingReady(false);

    if (nextAB >= AT_BATS) {
      // Run complete — build summary
      endRun(nextAB);
      return;
    }

    if (phase === "feedback" && !isAtBatOver()) {
      // Same at-bat, just next pitch
      setPhase("selecting");
      if ((nextAB % 2 !== 0) || mode === "batting") {
        // Re-trigger batting pitch if staying in batting mode
      }
      return;
    }

    // Next at-bat
    setAtBatIndex(nextAB);
    setPhase("selecting");
  }

  function isAtBatOver() {
    const { balls, strikes } = count;
    return balls >= 4 || strikes >= 3;
  }

  function endRun(finalABIndex) {
    const finalIQ = iq;
    const correct = allResults.filter(r =>
      ["EXPLOITS_WEAKNESS", "NEUTRAL", "GREAT_SWING", "GOOD_SWING", "GOOD_TAKE", "GREAT_CALL", "GOOD_READ"].includes(r.verdict)
    ).length;

    const runsImpact = allResults.reduce((sum, r) => sum + (r.iqDelta || 0) * 0.1, 0);

    const sorted = [...allResults].sort((a, b) => (b.iqDelta || 0) - (a.iqDelta || 0));
    const best  = sorted[0]  || null;
    const worst = sorted[sorted.length - 1] || null;

    onComplete(
      {
        seed:    seedRef.current,
        iqStart: initialIQ,
        iqEnd:   finalIQ,
        iqDelta: finalIQ - initialIQ,
        correct,
        total:   allResults.length,
        runsImpact: Math.round(runsImpact * 10) / 10,
        bestDecision:  best  ? { iqDelta: best.iqDelta,  explanation: best.explanation,  scenarioText: best.scenarioText  } : null,
        worstDecision: worst ? { iqDelta: worst.iqDelta, explanation: worst.explanation, scenarioText: worst.scenarioText } : null,
      },
      finalIQ
    );
  }

  // ── Feedback handler ──
  function handleFeedbackNext() {
    if (isAtBatOver()) {
      const nextAB = atBatIndex + 1;
      if (nextAB >= AT_BATS) {
        endRun(nextAB);
        return;
      }
      setAtBatIndex(nextAB);
      setCount({ balls: 0, strikes: 0 });
      setPitchHist([]);
      setSelZone(null);
      setSelPitch(null);
      setLastResult(null);
      setIncomingPitch(null);
      setBattingReady(false);
      setPhase("selecting");
    } else {
      setSelZone(null);
      setSelPitch(null);
      setLastResult(null);
      setIncomingPitch(null);
      setBattingReady(false);
      setPhase("selecting");
    }
  }

  // ── Render ──
  const pitchTypes = currentPitcher?.arsenal || ["Fastball"];
  const nextATBatMode = (atBatIndex + 1) % 2 === 0 ? "pitching" : "batting";

  return (
    <div className="atbat-screen">
      {/* TOP BAR */}
      <div className="atbat-topbar">
        <div className="atbat-counter">
          AT-BAT {atBatIndex + 1} OF {AT_BATS}
          <span className="atbat-mode-badge atbat-mode-badge--{mode}">
            {mode.toUpperCase()}
          </span>
        </div>
        <CountDisplay balls={count.balls} strikes={count.strikes} />
        <IQDisplay iq={iq} flash={iqFlash} />
        {streak >= 2 && (
          <span className="streak-badge">🔥 {streak}</span>
        )}
      </div>

      {/* FIELD */}
      <div className="atbat-field">
        <FieldDiagram runners={runners} />
        <div className="atbat-score">
          <span className="atbat-score-label">HOME</span>
          <span className="atbat-score-val">{score.home}</span>
          <span className="atbat-score-sep">·</span>
          <span className="atbat-score-label">AWAY</span>
          <span className="atbat-score-val">{score.away}</span>
          <span className="atbat-outs">{outs} OUT{outs !== 1 ? "S" : ""}</span>
        </div>
      </div>

      {/* MAIN GAME AREA */}
      {phase !== "wtp" ? (
        <div className="atbat-main">

          {/* Character cards */}
          <BatterCard batter={currentBatter} compact />
          <PitcherCard pitcher={currentPitcher} pitchHistory={pitchHist} />

          {/* PITCHING MODE */}
          {mode === "pitching" && (phase === "selecting" || phase === "animating") && (
            <>
              <div className="atbat-pitch-row">
                <PitchZoneGrid
                  selected={selZone}
                  onSelect={setSelZone}
                  disabled={phase !== "selecting"}
                />
              </div>

              <div className="pitch-type-row">
                {pitchTypes.map((pt, i) => (
                  <button
                    key={`${pt}-${i}`}
                    className={`pitch-type-btn ${selPitch === pt ? "pitch-type-btn--selected" : ""}`}
                    onClick={() => phase === "selecting" && setSelPitch(pt)}
                    disabled={phase !== "selecting"}
                  >
                    {pt}
                  </button>
                ))}
              </div>

              {selZone && selPitch && phase === "selecting" && (
                <button className="btn-throw px-box" onClick={handleThrow}>
                  THROW IT
                </button>
              )}

              <div className="atbat-ace">
                <AceSprite animation={aceAnim} size={100} />
              </div>
            </>
          )}

          {/* BATTING MODE */}
          {mode === "batting" && (phase === "selecting" || phase === "animating") && (
            <>
              {incomingPitch && (
                <div className="batting-incoming">
                  <div className="batting-pitch-type">{incomingPitch.pitch}</div>
                  <PitchZoneGrid
                    selected={null}
                    highlightZone={showZone ? incomingPitch.location : null}
                    disabled={true}
                  />
                </div>
              )}

              {battingReady && phase === "selecting" && (
                <div className="batting-decision">
                  <button
                    className="btn-swing px-box"
                    onClick={() => handleBatDecision("swing")}
                  >
                    SWING
                  </button>
                  <button
                    className="btn-take"
                    onClick={() => handleBatDecision("take")}
                  >
                    TAKE
                  </button>
                </div>
              )}

              <div className="atbat-ace">
                <AceSprite animation={aceAnim === "bat" ? "bat" : "idle"} size={100} />
              </div>
            </>
          )}

          {/* FEEDBACK */}
          {phase === "feedback" && lastResult && (
            <FeedbackPanel
              verdict={lastResult.matchupTier}
              iqDelta={lastIQDelta}
              explanation={lastResult.explanation}
              streak={streak}
              onNext={handleFeedbackNext}
              isLucky={lastResult.isLucky}
            />
          )}

        </div>
      ) : (
        /* WHERE'S THE PLAY INTERRUPT */
        <div className="wtp-overlay">
          <div className="wtp-header">WHERE'S THE PLAY?</div>
          <ScenarioCard scenario={wtpScenario} />
          {!wtpResult ? (
            <AnswerChoices
              choices={wtpScenario.choices}
              selected={wtpSelected}
              revealed={wtpRevealed}
              correctId={wtpScenario.correctAnswerId}
              onSelect={handleWTPSelect}
            />
          ) : (
            <>
              <AnswerChoices
                choices={wtpScenario.choices}
                selected={wtpSelected}
                revealed={true}
                correctId={wtpScenario.correctAnswerId}
                onSelect={() => {}}
              />
              <FeedbackPanel
                verdict={wtpResult.verdict}
                iqDelta={wtpResult.iqDelta}
                explanation={wtpResult.explanation}
                streak={streak}
                onNext={handleWTPNext}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
