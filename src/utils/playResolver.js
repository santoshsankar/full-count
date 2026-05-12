import { runners as runnersData } from "../data/runners";

// ─── THROW-OUT PROBABILITY ───────────────────────

export function resolveThrowOutProb(
  fielder, runner, distance, contactType
) {
  // Effective arm = weighted arm + release speed
  const effectiveArm =
    (fielder.arm * 0.6) + (fielder.release * 0.4);

  // Effective runner = weighted speed + aggression
  const effectiveRunner =
    (runner.speed * 0.7) + (runner.aggression * 0.3);

  // Base probability — arm advantage over 20-point scale
  let prob = (effectiveArm - effectiveRunner + 10) / 20;

  // Distance modifier
  if (distance === "short")  prob += 0.15;
  if (distance === "long")   prob -= 0.20;

  // Contact modifier
  if (contactType === "weak_contact") prob += 0.10;
  if (contactType === "hard_contact") prob -= 0.10;

  // Clamp 5%–90%
  return Math.min(0.90, Math.max(0.05, prob));
}

// ─── CONTACT DIRECTION ───────────────────────────

export function resolveContactDirection(
  pitch, location, batter, rng
) {
  const pullSide = batter.pullTendency;
  const isInside = location && location.includes("in");
  const isAway   = location && location.includes("away");

  let weights = { left: 0.33, center: 0.34, right: 0.33 };

  if (pullSide === "pull") {
    weights = isInside
      ? { left: 0.65, center: 0.25, right: 0.10 }
      : { left: 0.50, center: 0.30, right: 0.20 };
  } else if (pullSide === "opposite") {
    weights = isAway
      ? { left: 0.10, center: 0.25, right: 0.65 }
      : { left: 0.20, center: 0.30, right: 0.50 };
  }

  return rng.weightedPick([
    { result: "left",   weight: weights.left },
    { result: "center", weight: weights.center },
    { result: "right",  weight: weights.right }
  ]);
}

// ─── PLAY TYPE DETERMINATION ──────────────────────

function determinePlayType(runners, outs, contactType) {
  if (runners.third)  return "cutoff_decision";
  if (runners.second) return "cutoff_decision";
  if (runners.first && outs < 2) return "double_play_read";
  if (runners.first)  return "advance_or_hold";
  return "infield_where";
}

// ─── RUNNER DESCRIPTION HELPER ───────────────────

function buildRunnerDesc(runners) {
  const on = [];
  if (runners.first)  on.push("runner on first");
  if (runners.second) on.push("runner on second");
  if (runners.third)  on.push("runner on third");
  if (on.length === 0) return "Bases empty";
  if (on.length === 3) return "Bases loaded";
  return on.join(", ").replace(/,([^,]*)$/, " and$1");
}

// ─── QUESTION GENERATORS ─────────────────────────

function generateCutoffQuestion(
  situation, fielder, runner, runners,
  outs, direction, contactType
) {
  const distance = direction === "center"
    ? "long" : "medium";
  const baseProb = resolveThrowOutProb(
    fielder, runner, distance, contactType
  );

  // Direct throw is right when arm is strong,
  // distance is short-medium, and prob favors it
  const directIsRight =
    baseProb > 0.45 &&
    fielder.arm >= 7 &&
    direction !== "center";

  const correctId = directIsRight ? "a" : "b";
  const pct = Math.round(baseProb * 100);

  return {
    situation,
    prompt: "Does your fielder throw directly home or hit the cutoff man?",
    choices: [
      { id: "a", text: `Throw directly home — ${fielder.shortName} has the arm` },
      { id: "b", text: "Hit the cutoff man — relay is the safer throw" },
      { id: "c", text: "Hold the ball — no play exists at the plate" },
      { id: "d", text: "Throw to second to hold the batter" }
    ],
    correctAnswerId: correctId,
    iqDeltaCorrect: fielder.arm >= 8 ? 8 : 6,
    iqDeltaWrong: -4,
    explanationCorrect: directIsRight
      ? `${fielder.shortName} has the arm for this. ` +
        `${pct}% throw-out chance on a direct throw against ` +
        `a ${runner.shortName}. Bypass the cutoff — ` +
        `the relay costs time you don't need to give up.`
      : `Hit the cutoff. ${fielder.shortName} doesn't have ` +
        `the arm to beat a ${runner.shortName} ` +
        `with a direct throw from ${direction} field. ` +
        `Only ${pct}% throw-out chance going direct. ` +
        `The relay keeps it accurate and on a line.`,
    explanationWrong: directIsRight
      ? `The relay costs you this play. ` +
        `${fielder.shortName} has a cannon — ` +
        `${pct}% throw-out chance going direct. ` +
        `The extra catch-and-transfer in the relay ` +
        `lets the ${runner.shortName} score easily.`
      : `A direct throw home from ${direction} field ` +
        `with ${fielder.shortName}'s arm against ` +
        `a ${runner.shortName} arrives late or sails wide. ` +
        `Only ${pct}% chance of the out. ` +
        `Hit the cutoff — higher percentage every time.`,
    isDynamic: true,
    _context: {
      fielder, runner, runners, direction, contactType, outs
    }
  };
}

function generateAdvanceQuestion(
  situation, fielder, runner, runners,
  outs, direction, contactType
) {
  const baseProb = resolveThrowOutProb(
    fielder, runner, "medium", contactType
  );
  const shouldGo =
    baseProb < 0.40 || runner.aggression >= 8;
  const correctId = shouldGo ? "a" : "b";
  const pct = Math.round(baseProb * 100);
  const safePct = 100 - pct;

  return {
    situation,
    prompt: "Runner on first — does he try to take third on this hit?",
    choices: [
      { id: "a", text: "Yes — send him, take the extra base" },
      { id: "b", text: "No — hold at second, don't risk the out" },
      { id: "c", text: "Only go if the fielder bobbles it" },
      { id: "d", text: "Go only if there are two outs" }
    ],
    correctAnswerId: correctId,
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: shouldGo
      ? `Send him. ${runner.shortName} against ` +
        `${fielder.shortName} — ${safePct}% safe rate. ` +
        `The arm doesn't scare you here. ` +
        `Take the base and put pressure on the defense.`
      : `Hold at second. ${fielder.shortName} throws out ` +
        `${pct}% of runners attempting this. ` +
        `A ${runner.shortName} doesn't win this matchup. ` +
        `Second base is scoring position — let the next batter work.`,
    explanationWrong: shouldGo
      ? `Holding here gives up a free base. ` +
        `${runner.shortName} is safe ${safePct}% of the time ` +
        `against ${fielder.shortName}. ` +
        `The aggressive play is the right play here.`
      : `Getting thrown out here kills the inning. ` +
        `${fielder.shortName} throws out ${pct}% of runners ` +
        `attempting this against a ${runner.shortName}. ` +
        `Stay at second.`,
    isDynamic: true,
    _context: {
      fielder, runner, runners, direction, contactType, outs
    }
  };
}

function generateDPQuestion(
  situation, fielder, runner, runners, outs, contactType
) {
  const goForTwo = outs === 0;
  const correctId = goForTwo ? "a" : "b";

  return {
    situation,
    prompt: "Runner on first, ball in play — do you try to turn two?",
    choices: [
      { id: "a", text: "Yes — turn the double play" },
      { id: "b", text: "No — take the sure out at first" },
      { id: "c", text: "Throw home — ignore the double play" },
      { id: "d", text: "Tag the runner, then throw to first" }
    ],
    correctAnswerId: correctId,
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: goForTwo
      ? `Nobody out — two outs for one is always the trade. ` +
        `Go for the double play. Even if the relay is close, ` +
        `the upside of ending the inning outweighs the risk.`
      : `One out already — take the sure out at first. ` +
        `Gambling on the relay with one out risks an error ` +
        `that keeps the inning alive. Two outs is the goal.`,
    explanationWrong: goForTwo
      ? `With nobody out you need two outs, not one. ` +
        `Taking the easy out at first leaves a runner on ` +
        `with one out when you could have ended the inning.`
      : `Gambling on the double play with one out risks ` +
        `a throwing error. Take the guaranteed out at first ` +
        `and end the at-bat cleanly.`,
    isDynamic: true,
    _context: {
      fielder, runner, runners,
      direction: "infield", contactType, outs
    }
  };
}

function generateInfieldQuestion(
  situation, fielder, runner, runners, outs, contactType
) {
  return {
    situation,
    prompt: "Ball in play — where does the fielder throw?",
    choices: [
      { id: "a", text: "First base — get the batter out" },
      { id: "b", text: "Second base" },
      { id: "c", text: "Hold the ball" },
      { id: "d", text: "Home plate" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect:
      "Bases empty — first base is always the play. " +
      "Get the out and move on to the next batter.",
    explanationWrong:
      "With nobody on base the only play is getting the " +
      "batter out at first. No runners to worry about anywhere else.",
    isDynamic: true,
    _context: {
      fielder, runner, runners,
      direction: "infield", contactType, outs
    }
  };
}

// ─── MAIN ENTRY POINT ────────────────────────────

export function resolveDynamicPlay({
  contactType,
  direction,
  fielder,
  runner,
  runners,
  outs,
  score,
  rng
}) {
  const playType = determinePlayType(
    runners, outs, contactType
  );

  const runnerDesc  = buildRunnerDesc(runners);
  const outsDesc    = `${outs} out${outs !== 1 ? "s" : ""}`;
  const contactDesc = contactType === "hard_contact"
    ? "hard hit ball" : "softly hit ball";
  const dirDesc = direction === "left"
    ? "left field"
    : direction === "right"
    ? "right field"
    : direction === "center"
    ? "center field"
    : "the infield";

  const situation =
    `${runnerDesc}, ${outsDesc}. ` +
    `${contactDesc} to ${dirDesc}. ` +
    `Your fielder: ${fielder.shortName}. ` +
    `Runner: ${runner.shortName}.`;

  if (playType === "cutoff_decision") {
    return generateCutoffQuestion(
      situation, fielder, runner, runners,
      outs, direction, contactType
    );
  }
  if (playType === "advance_or_hold") {
    return generateAdvanceQuestion(
      situation, fielder, runner, runners,
      outs, direction, contactType
    );
  }
  if (playType === "double_play_read") {
    return generateDPQuestion(
      situation, fielder, runner, runners,
      outs, contactType
    );
  }
  // infield_where (bases empty)
  return generateInfieldQuestion(
    situation, fielder, runner, runners,
    outs, contactType
  );
}

// ─── PLAY RESOLUTION FROM DECISION ───────────────

export function resolvePlayFromDecision({
  playerChoice,
  correctChoice,
  fielder,
  runner,
  runners,
  outs,
  contactType,
  direction,
  rng
}) {
  const isCorrect = playerChoice === correctChoice;

  const distance = direction === "center"
    ? "long"
    : direction === "infield"
    ? "short"
    : "medium";

  const baseProb = resolveThrowOutProb(
    fielder, runner, distance, contactType
  );

  // Decision shifts probability ±25%
  const adjustedProb = isCorrect
    ? Math.min(0.90, baseProb + 0.25)
    : Math.max(0.05, baseProb - 0.25);

  // Seeded RNG draw
  const isOut = rng.next() < adjustedProb;

  // IQ delta
  const iqDelta = isCorrect && isOut   ?  8
    : isCorrect && !isOut              ?  3
    : !isCorrect && isOut              ? -2
    :                                    -5;

  // Game consequence
  let runsScored = 0;
  let runnersAfter = { ...runners };

  if (isOut) {
    // Remove the lead advancing runner. Priority: third → second → first.
    if (runners.third)       runnersAfter.third  = false;
    else if (runners.second) runnersAfter.second = false;
    else if (runners.first)  runnersAfter.first  = false;
    runsScored = 0;
  } else {
    // Runner safe — advance all runners as a single
    runsScored = runners.third ? 1 : 0;
    runnersAfter = {
      first:  true,
      second: runners.first  || false,
      third:  runners.second || false,
    };
  }

  const resultLabel =
    isCorrect && isOut   ? "GREAT CALL"
    : isCorrect && !isOut  ? "GOOD CALL — TOUGH BREAK"
    : !isCorrect && isOut  ? "GOT LUCKY"
    :                        "WRONG CALL";

  return {
    isOut,
    iqDelta,
    runsScored,
    runnersAfter,
    outsAdded:    isOut ? 1 : 0,
    resultLabel,
    isCorrect,
    isLucky:      !isCorrect && isOut,
    isToughBreak: isCorrect && !isOut,
    throwOutProb: Math.round(adjustedProb * 100),
    baseThrowOutProb: Math.round(baseProb * 100),
    fielderName:  fielder.shortName,
    runnerName:   runner.shortName
  };
}
