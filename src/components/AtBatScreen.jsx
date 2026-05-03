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
import PhaseIntro    from "./PhaseIntro";
import { batters  }  from "../data/batters";
import { pitchers }  from "../data/pitchers";
import { whereIsThePlay } from "../data/whereIsThePlay";
import {
  SeededRNG, resolvePitch, getCPUPitch, getBattingIQDelta,
  resolveContact, advanceRunners, pickArchetypes, getMatchupTier,
  buildBattingExplanation,
} from "../utils/simEngine";
import { applyIQDelta, getStreakBonus } from "../utils/scoring";

const AT_BATS = 6; // 3 pitching + 3 batting, alternating

// Pre-set base/out situations so each at-bat has narrative tension and scoring is plausible
const AT_BAT_PRESETS = [
  { runners: { first: false, second: false, third: false }, outs: 0, blurb: "Bases empty. Nobody on, nobody out." },
  { runners: { first: true,  second: false, third: false }, outs: 0, blurb: "Runner on first, nobody out." },
  { runners: { first: true,  second: true,  third: false }, outs: 1, blurb: "Runners on first and second, one out." },
  { runners: { first: false, second: false, third: true  }, outs: 2, blurb: "Runner on third, two outs." },
  { runners: { first: true,  second: true,  third: true  }, outs: 1, blurb: "Bases loaded, one out." },
  { runners: { first: false, second: true,  third: false }, outs: 2, blurb: "Late innings. Runner on second, two outs." },
];

// Pick a WTP scenario by difficulty AND type (defense for pitching, baserunning for batting)
function pickWTP(rng, difficulty, type) {
  const byDiff = whereIsThePlay.filter(s => s.difficulty === difficulty);
  const byType = byDiff.filter(s => s.type === type);
  if (byType.length) return rng.pick(byType);
  // Fall back to any same-difficulty scenario, then any scenario
  const any = whereIsThePlay.filter(s => s.type === type);
  if (any.length) return rng.pick(any);
  return rng.pick(byDiff.length ? byDiff : whereIsThePlay);
}

const WEAKNESS_HINT = {
  away:     "He chases pitches off the outside corner.",
  inside:   "He has trouble with pitches in on the hands.",
  high:     "He struggles with hard stuff up in the zone.",
  low:      "He chases breaking balls down out of the zone.",
  breaking: "He has trouble with breaking balls.",
};

const PITCH_OUTCOME_HEADLINE = {
  ball:          "BALL",
  whiff:         "SWING AND MISS",
  foul:          "FOUL BALL",
  called_strike: "CALLED STRIKE",
  weak_contact:  "BALL IN PLAY",
  hard_contact:  "BALL IN PLAY",
};

const PLAY_HEADLINE = {
  strikeout:  "STRIKEOUT",
  walk:       "WALK",
  out:        "FIELDED OUT",
  single:     "BASE HIT — SINGLE",
  extra_base: "EXTRA-BASE HIT",
  home_run:   "HOME RUN!",
};

function buildHeadline(lastResult) {
  if (!lastResult) return "";
  const { outcome, play, runsScored } = lastResult;
  // If the at-bat ended, the play headline is more specific
  if (play && PLAY_HEADLINE[play]) {
    const base = PLAY_HEADLINE[play];
    if (runsScored > 0) {
      return `${base} — ${runsScored} RUN${runsScored > 1 ? "S" : ""} SCORE${runsScored > 1 ? "" : "S"}`;
    }
    return base;
  }
  return PITCH_OUTCOME_HEADLINE[outcome] || "";
}

export default function AtBatScreen({ onComplete, initialIQ, difficulty = "pro" }) {
  const seedRef = useRef(Date.now() % 100000);
  const rngRef  = useRef(new SeededRNG(seedRef.current));

  const [runBatters]  = useState(() => pickArchetypes(batters,  AT_BATS, rngRef.current));
  const [runPitchers] = useState(() => pickArchetypes(pitchers, AT_BATS, rngRef.current));

  // ── Run progress ──
  const [atBatIndex, setAtBatIndex] = useState(0);
  const [iq,         setIQ]         = useState(initialIQ);
  const [streak,     setStreak]     = useState(0);
  const [allResults, setAllResults] = useState([]);
  const [iqFlash,    setIQFlash]    = useState(null);

  // ── At-bat state ──
  const [count,    setCount]   = useState({ balls: 0, strikes: 0 });
  const [outs,     setOuts]    = useState(AT_BAT_PRESETS[0].outs);
  const [runners,  setRunners] = useState(AT_BAT_PRESETS[0].runners);
  const [score,    setScore]   = useState({ home: 0, away: 0 });
  const [pitchHist,setPitchHist]= useState([]);

  // ── UI phase ──
  const [phase, setPhase] = useState("intro"); // intro|selecting|animating|feedback|wtp-intro|wtp
  const [aceAnim,setAceAnim] = useState("idle");

  // ── Pitching mode ──
  const [selZone,  setSelZone]  = useState(null);
  const [selPitch, setSelPitch] = useState(null);

  // ── Batting mode ──
  const [incomingPitch, setIncomingPitch] = useState(null);
  const [zoneRevealed,  setZoneRevealed]  = useState(false); // true once the location appears
  const [battingReady,  setBattingReady]  = useState(false);

  // ── Result + WTP ──
  const [lastResult, setLastResult]   = useState(null);
  const [wtpScenario, setWTPScenario] = useState(null);
  const [wtpSelected, setWTPSelected] = useState(null);
  const [wtpRevealed, setWTPRevealed] = useState(false);
  const [wtpResult,   setWTPResult]   = useState(null);
  const [lastIQDelta, setLastIQDelta] = useState(0);
  const [atBatEnded,  setAtBatEnded]  = useState(false);
  const [pendingWTP,  setPendingWTP]  = useState(false);

  const mode          = atBatIndex % 2 === 0 ? "pitching" : "batting";
  const currentBatter = runBatters[atBatIndex]  || batters[0];
  const currentPitcher= runPitchers[atBatIndex] || pitchers[0];
  const weaknessHint  = WEAKNESS_HINT[currentBatter?.zoneWeakness] || "";

  // ── Helpers ──
  function flashIQ(dir) {
    setIQFlash(dir);
    setTimeout(() => setIQFlash(null), 400);
  }

  function applyResult(result) {
    const { iqDelta, matchupTier, explanation, isLucky } = result;

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
      scenarioText: `${selPitch || incomingPitch?.pitch || ""} — ${currentBatter?.playerName || ""}`,
      isLucky,
    }]);
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
      count, pitchHist, rngRef.current,
      "pitching"
    );

    setPitchHist(prev => [...prev, { pitch: selPitch, location: selZone }]);

    setTimeout(() => {
      setAceAnim("idle");
      applyResult(result);

      const { atBatOver, contactType } = updateCount(result.outcome);
      let playInfo = { play: null, runsScored: 0 };
      if (atBatOver) {
        setAtBatEnded(true);
        playInfo = resolveAtBatEnd(contactType);
      }

      setLastResult({ ...result, ...playInfo });

      // Queue a contextual scenario for ball-in-play (skip on home run — no play to make)
      if (
        atBatOver &&
        (contactType === "weak_contact" || contactType === "hard_contact") &&
        playInfo.play !== "home_run"
      ) {
        const wtpType = mode === "pitching" ? "defense" : "baserunning";
        const wtp = pickWTP(rngRef.current, difficulty, wtpType);
        setWTPScenario(wtp);
        setWTPSelected(null);
        setWTPRevealed(false);
        setWTPResult(null);
        setPendingWTP(true);
      }

      setPhase("feedback");
    }, 800);
  }

  // ── Batting mode: present incoming pitch ──
  function startBattingPitch() {
    const incoming = getCPUPitch(currentPitcher, count, rngRef.current);
    setIncomingPitch(incoming);
    setZoneRevealed(false);
    setBattingReady(false);

    // Brief windup delay, then reveal location
    setTimeout(() => {
      setZoneRevealed(true);
      setBattingReady(true);
    }, 1200);
  }

  useEffect(() => {
    if (mode === "batting" && phase === "selecting" && !incomingPitch) {
      startBattingPitch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, phase, atBatIndex]);

  const handleIntroDone = useCallback(() => {
    setPhase("selecting");
  }, []);

  const handleWTPIntroDone = useCallback(() => {
    setPhase("wtp");
  }, []);

  // ── Batting mode: player swings or takes ──
  function handleBatDecision(decision) {
    if (!battingReady || !incomingPitch || phase !== "selecting") return;

    setPhase("animating");
    setAceAnim(decision === "swing" ? "bat" : "idle");

    const { pitch, location } = incomingPitch;
    const iqInfo = getBattingIQDelta(decision, location, currentPitcher, count);

    const simResult = resolvePitch(
      pitch, location, currentBatter,
      count, pitchHist, rngRef.current,
      "batting"
    );

    // Re-derive the outcome from the player's actual decision (the sim only suggests one)
    let outcome = simResult.outcome;
    if (decision === "take") {
      // Took the pitch — umpire calls it
      outcome = location === "ball" ? "ball" : "called_strike";
    } else {
      // Swung — never a "ball"
      if (location === "ball") {
        // Chased out of zone → almost always whiff
        outcome = rngRef.current.next() < 0.85 ? "whiff" : "foul";
      } else if (outcome === "ball") {
        // Sim said "ball" on an in-zone swing → coerce to foul
        outcome = "foul";
      }
    }

    const battingExplanation = buildBattingExplanation(
      iqInfo.verdict, decision, pitch, location, currentPitcher
    );

    const combinedResult = {
      ...simResult,
      outcome,
      iqDelta:     iqInfo.delta,
      matchupTier: iqInfo.verdict,
      explanation: battingExplanation,
      isLucky:     false,
    };

    setPitchHist(prev => [...prev, { pitch, location }]);

    setTimeout(() => {
      setAceAnim("idle");
      applyResult(combinedResult);

      const { atBatOver, contactType } = updateCount(outcome);
      let playInfo = { play: null, runsScored: 0 };
      if (atBatOver) {
        setAtBatEnded(true);
        playInfo = resolveAtBatEnd(contactType);
      }

      setLastResult({ ...combinedResult, ...playInfo });

      if (
        atBatOver &&
        (contactType === "weak_contact" || contactType === "hard_contact") &&
        playInfo.play !== "home_run"
      ) {
        const wtpType = mode === "pitching" ? "defense" : "baserunning";
        const wtp = pickWTP(rngRef.current, difficulty, wtpType);
        setWTPScenario(wtp);
        setWTPSelected(null);
        setWTPRevealed(false);
        setWTPResult(null);
        setPendingWTP(true);
      }

      setIncomingPitch(null);
      setZoneRevealed(false);
      setBattingReady(false);

      setPhase("feedback");
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
    // WTP only fires after a ball-in-play, which always ends the at-bat.
    setWTPScenario(null);
    setWTPSelected(null);
    setWTPRevealed(false);
    setWTPResult(null);
    advanceAfterAtBat();
  }

  function advanceAfterAtBat() {
    const nextAB = atBatIndex + 1;
    if (nextAB >= AT_BATS) {
      endRun(nextAB);
      return;
    }
    const preset = AT_BAT_PRESETS[nextAB] || AT_BAT_PRESETS[0];
    setAtBatIndex(nextAB);
    setAtBatEnded(false);
    setCount({ balls: 0, strikes: 0 });
    setPitchHist([]);
    setSelZone(null);
    setSelPitch(null);
    setLastResult(null);
    setIncomingPitch(null);
    setZoneRevealed(false);
    setBattingReady(false);
    setRunners(preset.runners);
    setOuts(preset.outs);
    setPhase("intro");
  }

  function resolveAtBatEnd(contactType) {
    if (contactType === "strikeout") {
      setOuts(outs + 1);
      return { play: "strikeout", runsScored: 0 };
    }
    if (contactType === "walk") {
      const { runners: newRunners, runsScored } = advanceRunners(runners, "walk");
      setRunners(newRunners);
      updateScore(runsScored);
      return { play: "walk", runsScored };
    }
    if (contactType === "weak_contact" || contactType === "hard_contact") {
      const play = resolveContact(contactType, rngRef.current);
      if (play === "out") {
        setOuts(outs + 1);
        return { play: "out", runsScored: 0 };
      }
      const { runners: newRunners, runsScored } = advanceRunners(runners, play);
      setRunners(newRunners);
      updateScore(runsScored);
      return { play, runsScored };
    }
    return { play: null, runsScored: 0 };
  }

  function updateScore(runsScored) {
    if (runsScored <= 0) return;
    if (mode === "batting") {
      setScore(s => ({ ...s, home: s.home + runsScored }));
    } else {
      setScore(s => ({ ...s, away: s.away + runsScored }));
    }
  }

  function isAtBatOver() {
    const { balls, strikes } = count;
    return balls >= 4 || strikes >= 3;
  }

  function endRun(finalABIndex) {
    const finalIQ = iq;
    const correct = allResults.filter(r =>
      ["EXPLOITS_WEAKNESS", "NEUTRAL", "GREAT_SWING", "GOOD_SWING", "GOOD_TAKE"].includes(r.verdict)
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
        finalScore: { home: score.home, away: score.away },
        bestDecision:  best  ? { iqDelta: best.iqDelta,  explanation: best.explanation,  scenarioText: best.scenarioText  } : null,
        worstDecision: worst ? { iqDelta: worst.iqDelta, explanation: worst.explanation, scenarioText: worst.scenarioText } : null,
      },
      finalIQ
    );
  }

  // ── Feedback handler ──
  function handleFeedbackNext() {
    // Ball-in-play queued a defensive scenario — go to it now
    if (pendingWTP) {
      setPendingWTP(false);
      setPhase("wtp-intro");
      return;
    }
    if (atBatEnded || isAtBatOver()) {
      advanceAfterAtBat();
      return;
    }
    // Mid-at-bat: continue with the next pitch
    setSelZone(null);
    setSelPitch(null);
    setLastResult(null);
    setPhase("selecting");
  }

  // ── Render ──
  const pitchTypes = currentPitcher?.arsenal || ["Fastball"];
  const pitchHeadline = buildHeadline(lastResult);

  return (
    <div className="atbat-screen">
      {phase === "intro" && (
        <PhaseIntro
          variant={mode}
          blurb={AT_BAT_PRESETS[atBatIndex]?.blurb}
          onDone={handleIntroDone}
        />
      )}
      {phase === "wtp-intro" && (
        <PhaseIntro
          variant={mode === "batting" ? "wtp-baserunning" : "wtp"}
          onDone={handleWTPIntroDone}
        />
      )}

      {/* TOP BAR */}
      <div className="atbat-topbar">
        <div className="atbat-counter">
          AT-BAT {atBatIndex + 1} OF {AT_BATS}
          <span className={`atbat-mode-badge atbat-mode-badge--${mode}`}>
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
              <div className="atbat-instructions">
                <div className="atbat-instructions__title">YOUR JOB</div>
                <div className="atbat-instructions__body">
                  Pick a <strong>pitch type</strong> and a <strong>spot</strong> in the zone.
                  {weaknessHint && <> {weaknessHint}</>}
                </div>
              </div>

              <div className="atbat-pitch-row">
                <PitchZoneGrid
                  selected={selZone}
                  onSelect={setSelZone}
                  disabled={phase !== "selecting"}
                />
              </div>

              <div className="pitch-type-row">
                <div className="pitch-type-row__label">PITCH TYPE</div>
                <div className="pitch-type-row__buttons">
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
              </div>

              {selZone && selPitch && phase === "selecting" && (
                <button className="btn-throw px-box" onClick={handleThrow}>
                  THROW IT
                </button>
              )}
              {(!selZone || !selPitch) && phase === "selecting" && (
                <div className="atbat-hint">
                  {!selPitch && !selZone && "Pick a pitch type and a location."}
                  {selPitch && !selZone && "Pick a location in the zone."}
                  {!selPitch && selZone && "Pick a pitch type."}
                </div>
              )}

              <div className="atbat-ace">
                <AceSprite animation={aceAnim} size={100} />
              </div>
            </>
          )}

          {/* BATTING MODE */}
          {mode === "batting" && (phase === "selecting" || phase === "animating") && (
            <>
              <div className="atbat-instructions">
                <div className="atbat-instructions__title">YOUR JOB</div>
                <div className="atbat-instructions__body">
                  {!zoneRevealed
                    ? "He's about to throw. Watch where the pitch lands on the grid below."
                    : "The location is highlighted. Decide: SWING if it's a strike worth attacking, TAKE if it's a ball or unhittable."}
                </div>
              </div>

              <div className="batting-incoming">
                <div className={`batting-pitch-type ${zoneRevealed ? "batting-pitch-type--in" : "batting-pitch-type--coming"}`}>
                  {zoneRevealed ? incomingPitch?.pitch : "WINDING UP…"}
                </div>
                <PitchZoneGrid
                  selected={null}
                  highlightZone={zoneRevealed ? incomingPitch?.location : null}
                  disabled={true}
                />
                {zoneRevealed && incomingPitch?.location === "ball" && (
                  <div className="batting-offplate">⚠ Pitch is OFF the plate</div>
                )}
              </div>

              {battingReady && phase === "selecting" && (
                <div className="batting-decision">
                  <button
                    className="btn-swing px-box"
                    onClick={() => handleBatDecision("swing")}
                  >
                    SWING
                  </button>
                  <button
                    className="btn-take px-box"
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
              headline={pitchHeadline}
              nextLabel={pendingWTP ? "DEFENSIVE PLAY ▸" : (atBatEnded ? "NEXT AT-BAT ▸" : "NEXT PITCH ▸")}
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
                nextLabel={atBatIndex + 1 >= AT_BATS ? "FINAL ▸" : "NEXT AT-BAT ▸"}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
