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
import { fielders }  from "../data/fielders";
import { runners as runnersData } from "../data/runners";
import { whereIsThePlay } from "../data/whereIsThePlay";
import {
  SeededRNG, resolvePitch, getCPUPitch, getBattingIQDelta,
  advanceRunners, pickArchetypes,
  buildBattingExplanation,
} from "../utils/simEngine";
import {
  resolveDynamicPlay, resolvePlayFromDecision, resolveContactDirection,
} from "../utils/playResolver";
import { applyIQDelta, getStreakBonus } from "../utils/scoring";

// Game structure: a stylized 3-inning baseball game with 6 half-innings.
// Player is always HOME. Top half = pitching, Bottom half = batting.
const TOTAL_INNINGS = 3;

// Pre-pick a generous pool of archetypes so PAs can extend within long
// half-innings without running out.
const ARCHETYPE_POOL = 30;

// Hard cap on PAs per half-inning. Invisible to good players (3 outs comes
// first under normal play); catches pathological no-out half-innings.
const MAX_PAS_PER_HALF = 6;

// ─── WTP filtering (static scenarios — used as fallback) ────────────

function matchesRunners(scenario, runners) {
  const req = scenario.runnerRequirements;
  if (!req) return true;
  if (req.anyRunner) {
    return runners.first || runners.second || runners.third;
  }
  if (req.first && !runners.first) return false;
  if (req.second && !runners.second) return false;
  if (req.third && !runners.third) return false;
  return true;
}

function pickWTP(rng, difficulty, type, runners) {
  const pool = whereIsThePlay;

  let candidates = pool.filter(s =>
    s.difficulty === difficulty &&
    s.type === type &&
    matchesRunners(s, runners)
  );
  if (candidates.length) return rng.pick(candidates);

  candidates = pool.filter(s =>
    s.type === type &&
    matchesRunners(s, runners)
  );
  if (candidates.length) return rng.pick(candidates);

  candidates = pool.filter(s =>
    s.difficulty === difficulty &&
    s.type === type
  );
  if (candidates.length) return rng.pick(candidates);

  candidates = pool.filter(s => s.type === type);
  if (candidates.length) return rng.pick(candidates);

  return rng.pick(pool);
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
  home_run:   "HOME RUN!",
};

function buildHeadline(lastResult) {
  if (!lastResult) return "";
  const { outcome, play, runsScored } = lastResult;
  if (play && PLAY_HEADLINE[play]) {
    const base = PLAY_HEADLINE[play];
    if (runsScored > 0) {
      return `${base} — ${runsScored} RUN${runsScored > 1 ? "S" : ""} SCORE${runsScored > 1 ? "" : "S"}`;
    }
    return base;
  }
  return PITCH_OUTCOME_HEADLINE[outcome] || "";
}

function buildRunnerDesc(runners) {
  const on = [];
  if (runners.first)  on.push("Runner on first");
  if (runners.second) on.push("runner on second");
  if (runners.third)  on.push("runner on third");
  if (on.length === 0) return "Bases empty";
  if (runners.first && runners.second && runners.third) return "Bases loaded";
  const joined = on.join(", ");
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function buildHalfInningBlurb(runners, outs, inning, halfInning, mode, score) {
  const runnerDesc = buildRunnerDesc(runners);
  const outsDesc   = `${outs} out${outs !== 1 ? "s" : ""}`;
  const inningDesc = `${halfInning === "top" ? "Top" : "Bottom"} of the ${ordinal(inning)}`;
  const roleDesc   = mode === "pitching"
    ? "You're on the mound."
    : "You're at the plate.";
  const scoreDesc  = `HOME ${score.home} · AWAY ${score.away}`;
  return `${inningDesc}. ${scoreDesc}. ${runnerDesc}. ${outsDesc}. ${roleDesc}`;
}

export default function AtBatScreen({ onComplete, initialIQ, difficulty = "pro", isFirstRun = false }) {
  const seedRef = useRef(Date.now() % 100000);
  const rngRef  = useRef(new SeededRNG(seedRef.current));

  // Run-level archetypes — generous pool so half-innings can extend
  const [runBatters]           = useState(() => pickArchetypes(batters,     ARCHETYPE_POOL, rngRef.current));
  const [runPitchers]          = useState(() => pickArchetypes(pitchers,    ARCHETYPE_POOL, rngRef.current));
  const [runFielders]          = useState(() => pickArchetypes(fielders,    ARCHETYPE_POOL, rngRef.current));
  const [runRunnerArchetypes]  = useState(() => pickArchetypes(runnersData, ARCHETYPE_POOL, rngRef.current));

  // ── Run progress ──
  const [atBatIndex, setAtBatIndex] = useState(0);
  const [iq,         setIQ]         = useState(initialIQ);
  const [streak,     setStreak]     = useState(0);
  const [allResults, setAllResults] = useState([]);
  const [iqFlash,    setIQFlash]    = useState(null);

  // ── Game state (real baseball) ──
  // Top half = you pitch (away batting). Bottom half = you bat (home batting).
  const [mode,       setMode]       = useState("pitching");
  const [halfInning, setHalfInning] = useState("top");
  const [inning,     setInning]     = useState(1);
  const [count,      setCount]      = useState({ balls: 0, strikes: 0 });
  const [outs,       setOuts]       = useState(0);
  const [runners,    setRunners]    = useState({ first: false, second: false, third: false });
  const [score,      setScore]      = useState({ home: 0, away: 0 });
  const [pitchHist,  setPitchHist]  = useState([]);
  // Tally of PAs completed in the current half-inning. Resets on flip.
  const [halfInningPAs, setHalfInningPAs] = useState(0);

  // ── UI phase ──
  const [phase, setPhase] = useState("intro"); // intro|selecting|animating|feedback|wtp-intro|wtp
  const [aceAnim,setAceAnim] = useState("idle");

  // ── First-run onboarding ──
  const [onboardStep, setOnboardStep] = useState(() => {
    if (typeof window === "undefined") return "done";
    const alreadyOnboarded = window.localStorage.getItem("fullcount_onboarded") === "1";
    return isFirstRun && !alreadyOnboarded ? "pitch" : "done";
  });

  // ── Pitching mode ──
  const [selZone,  setSelZone]  = useState(null);
  const [selPitch, setSelPitch] = useState(null);

  // ── Batting mode ──
  const [incomingPitch, setIncomingPitch] = useState(null);
  const [zoneRevealed,  setZoneRevealed]  = useState(false);
  const [battingReady,  setBattingReady]  = useState(false);

  // ── Result + WTP ──
  const [lastResult,     setLastResult]     = useState(null);
  const [lastPlayResult, setLastPlayResult] = useState(null);
  const [wtpScenario,    setWTPScenario]    = useState(null);
  const [wtpSelected,    setWTPSelected]    = useState(null);
  const [wtpRevealed,    setWTPRevealed]    = useState(false);
  const [wtpResult,      setWTPResult]      = useState(null);
  const [lastIQDelta,    setLastIQDelta]    = useState(0);
  const [atBatEnded,     setAtBatEnded]     = useState(false);
  const [pendingWTP,     setPendingWTP]     = useState(false);

  // True only after a walk-off ends Bot 3rd mid-at-bat
  const [walkOffPending, setWalkOffPending] = useState(false);

  const currentBatter          = runBatters[atBatIndex % runBatters.length];
  const currentPitcher         = runPitchers[atBatIndex % runPitchers.length];
  const currentFielder         = runFielders[atBatIndex % runFielders.length];
  const currentRunnerArchetype = runRunnerArchetypes[atBatIndex % runRunnerArchetypes.length];
  const weaknessHint           = WEAKNESS_HINT[currentBatter?.zoneWeakness] || "";

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

  function recordOuts(addedOuts) {
    setOuts(o => o + addedOuts);
  }

  // Update score for the side whose half-inning is in progress.
  // Returns the new score so callers can detect walk-offs synchronously.
  function applyRuns(runsScored) {
    if (runsScored <= 0) return score;
    const newScore = {
      home: halfInning === "bottom" ? score.home + runsScored : score.home,
      away: halfInning === "top"    ? score.away + runsScored : score.away,
    };
    setScore(newScore);
    return newScore;
  }

  // Detect a home run on hard contact (10% — preserves prior HR likelihood).
  function rollHomeRun(contactType) {
    if (contactType !== "hard_contact") return false;
    return rngRef.current.next() < 0.10;
  }

  function buildDynamicWTP({ contactType, pitch, location, batter }) {
    try {
      const direction = resolveContactDirection(
        pitch, location, batter, rngRef.current
      );
      return resolveDynamicPlay({
        contactType,
        direction,
        fielder: currentFielder,
        runner:  currentRunnerArchetype,
        runners,
        outs,
        score,
        rng: rngRef.current,
      });
    } catch (err) {
      console.error("resolveDynamicPlay failed — falling back to static WTP", err);
      return null;
    }
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

      if (atBatOver && (contactType === "weak_contact" || contactType === "hard_contact")) {
        if (rollHomeRun(contactType)) {
          const { runners: newRunners, runsScored } = advanceRunners(runners, "home_run");
          setRunners(newRunners);
          applyRuns(runsScored);
          setAtBatEnded(true);
          playInfo = { play: "home_run", runsScored };
          setLastResult({ ...result, ...playInfo });
          setPhase("feedback");
          return;
        }

        let wtp = onboardStep === "done"
          ? buildDynamicWTP({
              contactType,
              pitch: selPitch,
              location: selZone,
              batter: currentBatter,
            })
          : null;
        if (!wtp) {
          const wtpType = mode === "pitching" ? "defense" : "baserunning";
          wtp = pickWTP(rngRef.current, difficulty, wtpType, runners);
        }
        setWTPScenario(wtp);
        setWTPSelected(null);
        setWTPRevealed(false);
        setWTPResult(null);
        setLastPlayResult(null);
        setPendingWTP(true);

        setLastResult({ ...result, ...playInfo });
        setPhase("feedback");
        return;
      }

      if (atBatOver) {
        setAtBatEnded(true);
        playInfo = resolveAtBatEnd(contactType);
      }

      setLastResult({ ...result, ...playInfo });
      setPhase("feedback");
    }, 800);
  }

  function startBattingPitch() {
    const incoming = getCPUPitch(currentPitcher, count, rngRef.current);
    setIncomingPitch(incoming);
    setZoneRevealed(false);
    setBattingReady(false);

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

    let outcome = simResult.outcome;
    if (decision === "take") {
      outcome = location === "ball" ? "ball" : "called_strike";
    } else {
      if (location === "ball") {
        outcome = rngRef.current.next() < 0.85 ? "whiff" : "foul";
      } else if (outcome === "ball") {
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

      if (atBatOver && (contactType === "weak_contact" || contactType === "hard_contact")) {
        if (rollHomeRun(contactType)) {
          const { runners: newRunners, runsScored } = advanceRunners(runners, "home_run");
          setRunners(newRunners);
          const newScore = applyRuns(runsScored);
          // Walk-off check: HOME goes ahead in Bot 3rd
          if (inning === TOTAL_INNINGS && halfInning === "bottom" && newScore.home > newScore.away) {
            setWalkOffPending(true);
          }
          setAtBatEnded(true);
          playInfo = { play: "home_run", runsScored };
          setLastResult({ ...combinedResult, ...playInfo });
          setIncomingPitch(null);
          setZoneRevealed(false);
          setBattingReady(false);
          setPhase("feedback");
          return;
        }

        let wtp = onboardStep === "done"
          ? buildDynamicWTP({
              contactType,
              pitch,
              location,
              batter: currentBatter,
            })
          : null;
        if (!wtp) {
          const wtpType = mode === "pitching" ? "defense" : "baserunning";
          wtp = pickWTP(rngRef.current, difficulty, wtpType, runners);
        }
        setWTPScenario(wtp);
        setWTPSelected(null);
        setWTPRevealed(false);
        setWTPResult(null);
        setLastPlayResult(null);
        setPendingWTP(true);

        setLastResult({ ...combinedResult, ...playInfo });
        setIncomingPitch(null);
        setZoneRevealed(false);
        setBattingReady(false);
        setPhase("feedback");
        return;
      }

      if (atBatOver) {
        setAtBatEnded(true);
        playInfo = resolveAtBatEnd(contactType);
      }

      setLastResult({ ...combinedResult, ...playInfo });
      setIncomingPitch(null);
      setZoneRevealed(false);
      setBattingReady(false);
      setPhase("feedback");
    }, 600);
  }

  // ── WTP answer (causal path for dynamic; static path for fallback) ──
  function handleWTPSelect(choiceId) {
    if (wtpSelected) return;
    setWTPSelected(choiceId);

    const scenario = wtpScenario;
    const isCorrect = choiceId === scenario.correctAnswerId;

    let iqDelta;
    let playResult = null;

    if (scenario.isDynamic && scenario._context) {
      try {
        playResult = resolvePlayFromDecision({
          playerChoice:  choiceId,
          correctChoice: scenario.correctAnswerId,
          fielder:       scenario._context.fielder,
          runner:        scenario._context.runner,
          runners:       scenario._context.runners,
          outs:          scenario._context.outs,
          contactType:   scenario._context.contactType,
          direction:     scenario._context.direction,
          rng:           rngRef.current,
        });

        iqDelta = playResult.iqDelta;

        if (playResult.outsAdded > 0) {
          recordOuts(playResult.outsAdded);
        }
        setRunners(playResult.runnersAfter);

        if (playResult.runsScored > 0) {
          const newScore = applyRuns(playResult.runsScored);
          if (inning === TOTAL_INNINGS && halfInning === "bottom" && newScore.home > newScore.away) {
            setWalkOffPending(true);
          }
        }

        setLastPlayResult(playResult);
      } catch (err) {
        console.error("resolvePlayFromDecision failed — fallback to static IQ", err);
        iqDelta = isCorrect ? scenario.iqDeltaCorrect : scenario.iqDeltaWrong;
        playResult = null;
        setLastPlayResult(null);
      }
    } else {
      iqDelta = isCorrect ? scenario.iqDeltaCorrect : scenario.iqDeltaWrong;
      setLastPlayResult(null);
    }

    const newIQ = applyIQDelta(iq, iqDelta);
    const newStreak = iqDelta > 0 ? streak + 1 : 0;
    setIQ(newIQ);
    setStreak(newStreak);
    setLastIQDelta(iqDelta);
    flashIQ(iqDelta >= 0 ? "pos" : "neg");

    setWTPResult({
      iqDelta,
      isCorrect,
      resultLabel: playResult?.resultLabel || (isCorrect ? "GREAT CALL" : "WRONG CALL"),
      explanation: isCorrect ? scenario.explanationCorrect : scenario.explanationWrong,
      verdict: isCorrect ? "GREAT_CALL" : "WRONG_CALL",
      playResult,
    });

    setAllResults(prev => [...prev, {
      iqDelta,
      verdict: isCorrect ? "EXPLOITS_WEAKNESS" : "PITCHING_TO_STRENGTH",
      explanation: isCorrect ? scenario.explanationCorrect : scenario.explanationWrong,
      scenarioText: (scenario.prompt || scenario.situation || "").substring(0, 60) + "…",
    }]);

    setTimeout(() => setWTPRevealed(true), 50);
  }

  function handleWTPNext() {
    setWTPScenario(null);
    setWTPSelected(null);
    setWTPRevealed(false);
    setWTPResult(null);
    setLastPlayResult(null);
    advancePlay();
  }

  // ── Game flow ──

  // A half-inning ends when 3 outs are recorded OR the 6-PA hard cap is hit.
  function halfInningOver(currentOuts, paCount) {
    return currentOuts >= 3 || paCount >= MAX_PAS_PER_HALF;
  }

  // Returns true if game should end. Caller is responsible for calling endGame.
  function shouldEndGame(currentOuts, currentScore, paCount) {
    // Walk-off in Bot 3rd: home pulled ahead mid-at-bat
    if (walkOffPending) return true;
    if (inning === TOTAL_INNINGS && halfInning === "bottom" && currentScore.home > currentScore.away) {
      return true;
    }
    const halfOver = halfInningOver(currentOuts, paCount);
    // End of Bot 3rd
    if (halfOver && inning === TOTAL_INNINGS && halfInning === "bottom") {
      return true;
    }
    // End of Top 3rd with HOME leading → skip Bot 3rd
    if (halfOver && inning === TOTAL_INNINGS && halfInning === "top" && currentScore.home > currentScore.away) {
      return true;
    }
    return false;
  }

  // After any at-bat ending, decide what's next:
  //  - End game if a stop condition is met
  //  - Flip the half-inning if 3 outs were recorded OR the PA cap was hit
  //  - Otherwise continue with the next PA in the same half-inning
  function advancePlay() {
    const newPACount = halfInningPAs + 1;
    setHalfInningPAs(newPACount);

    if (shouldEndGame(outs, score, newPACount)) {
      endGame();
      return;
    }

    if (halfInningOver(outs, newPACount)) {
      flipHalfInning();
      return;
    }

    // Continue same half-inning, next PA
    setAtBatIndex(idx => idx + 1);
    setAtBatEnded(false);
    setCount({ balls: 0, strikes: 0 });
    setPitchHist([]);
    setSelZone(null);
    setSelPitch(null);
    setLastResult(null);
    setIncomingPitch(null);
    setZoneRevealed(false);
    setBattingReady(false);
    setPhase("selecting");
  }

  function flipHalfInning() {
    // Clear half-inning-scoped state
    setOuts(0);
    setRunners({ first: false, second: false, third: false });
    setHalfInningPAs(0);

    if (halfInning === "top") {
      setHalfInning("bottom");
      setMode("batting");
    } else {
      setHalfInning("top");
      setMode("pitching");
      setInning(i => i + 1);
    }

    // Reset PA-scoped state and show the half-inning intro card
    setAtBatIndex(idx => idx + 1);
    setAtBatEnded(false);
    setCount({ balls: 0, strikes: 0 });
    setPitchHist([]);
    setSelZone(null);
    setSelPitch(null);
    setLastResult(null);
    setIncomingPitch(null);
    setZoneRevealed(false);
    setBattingReady(false);
    setPhase("intro");
  }

  function resolveAtBatEnd(contactType) {
    if (contactType === "weak_contact" || contactType === "hard_contact") {
      console.warn("resolveAtBatEnd called for contact — use WTP flow");
      return { play: null, runsScored: 0 };
    }
    if (contactType === "strikeout") {
      recordOuts(1);
      return { play: "strikeout", runsScored: 0 };
    }
    if (contactType === "walk") {
      const { runners: newRunners, runsScored } = advanceRunners(runners, "walk");
      setRunners(newRunners);
      const newScore = applyRuns(runsScored);
      if (inning === TOTAL_INNINGS && halfInning === "bottom" && newScore.home > newScore.away) {
        setWalkOffPending(true);
      }
      return { play: "walk", runsScored };
    }
    return { play: null, runsScored: 0 };
  }

  function isAtBatOver() {
    const { balls, strikes } = count;
    return balls >= 4 || strikes >= 3;
  }

  function endGame() {
    const finalIQ = iq;
    const correct = allResults.filter(r =>
      ["EXPLOITS_WEAKNESS", "GREAT_SWING", "GOOD_SWING", "GOOD_TAKE"].includes(r.verdict)
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
    if (pendingWTP) {
      setPendingWTP(false);
      setPhase("wtp-intro");
      return;
    }
    if (atBatEnded || isAtBatOver()) {
      advancePlay();
      return;
    }
    // Mid-at-bat: continue with the next pitch
    setSelZone(null);
    setSelPitch(null);
    setLastResult(null);
    setPhase("selecting");
  }

  // ── Derived display values ──
  // The current PA hasn't been counted yet (advancePlay increments on NEXT click).
  // For label display we project: if the PA has ended, count it.
  function nextButtonLabel() {
    if (pendingWTP) {
      return mode === "batting" ? "ON THE BASES ▸" : "DEFENSIVE PLAY ▸";
    }
    if (!atBatEnded && !isAtBatOver()) {
      return "NEXT PITCH ▸";
    }
    const projected = halfInningPAs + 1;
    if (shouldEndGame(outs, score, projected)) return "FINAL ▸";
    if (halfInningOver(outs, projected)) {
      const nextHalf = halfInning === "top" ? "bottom" : "top";
      const nextInning = halfInning === "top" ? inning : inning + 1;
      return `${nextHalf === "top" ? "TOP" : "BOTTOM"} OF ${ordinal(nextInning).toUpperCase()} ▸`;
    }
    return "NEXT BATTER ▸";
  }

  function wtpNextLabel() {
    const projected = halfInningPAs + 1;
    if (shouldEndGame(outs, score, projected)) return "FINAL ▸";
    if (halfInningOver(outs, projected)) {
      const nextHalf = halfInning === "top" ? "bottom" : "top";
      const nextInning = halfInning === "top" ? inning : inning + 1;
      return `${nextHalf === "top" ? "TOP" : "BOTTOM"} OF ${ordinal(nextInning).toUpperCase()} ▸`;
    }
    return "NEXT BATTER ▸";
  }

  // ── Render ──
  const pitchTypes = currentPitcher?.arsenal || ["Fastball"];
  const pitchHeadline = buildHeadline(lastResult);
  const halfInningBlurb = buildHalfInningBlurb(runners, outs, inning, halfInning, mode, score);

  const showOnboardPitch = phase === "intro" && atBatIndex === 0 && onboardStep === "pitch";
  const showOnboardBat   = phase === "intro" && atBatIndex === 0 && onboardStep === "bat";
  const showHalfIntro    = phase === "intro" && !showOnboardPitch && !showOnboardBat;

  const wtpFielderName = wtpScenario?._context?.fielder?.shortName;
  const wtpRunnerName  = wtpScenario?._context?.runner?.shortName;

  return (
    <div className="atbat-screen">
      {showOnboardPitch && (
        <PhaseIntro
          variant="onboard-pitch"
          autoDismissMs={0}
          onDone={() => setOnboardStep("bat")}
        />
      )}
      {showOnboardBat && (
        <PhaseIntro
          variant="onboard-bat"
          autoDismissMs={0}
          onDone={() => {
            try { window.localStorage.setItem("fullcount_onboarded", "1"); } catch (e) { /* ignore */ }
            setOnboardStep("done");
          }}
        />
      )}
      {showHalfIntro && (
        <PhaseIntro
          variant={mode}
          blurb={halfInningBlurb}
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
          <span className="atbat-inning">
            {halfInning === "top" ? "TOP" : "BOT"} {ordinal(inning).toUpperCase()}
          </span>
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
              nextLabel={nextButtonLabel()}
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
                nextLabel={wtpNextLabel()}
                resultLabel={wtpResult.resultLabel}
                playResult={wtpResult.playResult}
                score={score}
                fielderName={wtpFielderName}
                runnerName={wtpRunnerName}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
