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
      fielder, runner, runners, direction, contactType, outs, mode: "pitching"
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
      fielder, runner, runners, direction, contactType, outs, mode: "batting"
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
      direction: "infield", contactType, outs, mode: "pitching"
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
      direction: "infield", contactType, outs, mode: "pitching"
    }
  };
}

// ─── DEFENSIVE: where to throw with a runner on first only ──

function generateDefenseAdvanceQuestion(
  situation, fielder, runner, runners, outs, direction, contactType
) {
  return {
    situation,
    prompt: "Ball in play with a runner on first — where does your fielder throw?",
    choices: [
      { id: "a", text: "First base — get the sure out on the batter" },
      { id: "b", text: "Second base — try to nab the lead runner" },
      { id: "c", text: "Third base — cut off the runner's advance" },
      { id: "d", text: "Hold the ball" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect:
      `Take the sure out at first. The runner from first will advance ` +
      `to second on the play — accept that. Getting the batter is the ` +
      `priority with two outs (or one).`,
    explanationWrong:
      `Trying to nab the lead runner instead of taking the batter ` +
      `at first is a classic mistake. The runner is already moving; ` +
      `the sure out is at first. Don't trade two outs for one.`,
    isDynamic: true,
    _context: {
      fielder, runner, runners, direction, contactType, outs, mode: "pitching"
    }
  };
}

// ─── OFFENSIVE: stretch a hit (bases empty) ──

function generateStretchQuestion(
  situation, fielder, runner, runners, outs, direction, contactType
) {
  const baseProb = resolveThrowOutProb(
    fielder, runner, "long", contactType
  );
  // Stretch if the fielder doesn't have the arm OR the batter has speed.
  const shouldStretch = baseProb < 0.40 || runner.speed >= 8;
  const correctId = shouldStretch ? "a" : "b";
  const pct = Math.round(baseProb * 100);
  const safePct = 100 - pct;

  return {
    situation,
    prompt: "You hit it past the infielder — do you stretch it into a double?",
    choices: [
      { id: "a", text: `Yes — push for second, ${fielder.shortName} doesn't scare you` },
      { id: "b", text: "No — take the single, get on base safely" },
      { id: "c", text: "Only if the fielder bobbles it" },
      { id: "d", text: "Stop halfway, read the throw" }
    ],
    correctAnswerId: correctId,
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: shouldStretch
      ? `Push for second. Against ${fielder.shortName}, you're safe at ` +
        `second ${safePct}% of the time. Take the extra base.`
      : `Take the single. ${fielder.shortName} would throw you out at ` +
        `second ${pct}% of the time. Don't run yourself out of the inning.`,
    explanationWrong: shouldStretch
      ? `Settling for a single gives up a free extra base. ${fielder.shortName} ` +
        `didn't have the arm to stop you on a deep one.`
      : `Trying to stretch against ${fielder.shortName} is a losing bet — ` +
        `${pct}% throw-out chance. You earned first base; don't gift them the out.`,
    isDynamic: true,
    _context: {
      fielder, runner, runners, direction, contactType, outs, mode: "batting"
    }
  };
}

// ─── OFFENSIVE: break up the double play (runner on 1, outs < 2) ──

function generateBreakUpDPQuestion(
  situation, fielder, runner, runners, outs, contactType
) {
  return {
    situation,
    prompt: "Ground ball with a runner on first — what's your approach as the batter?",
    choices: [
      { id: "a", text: "Run hard, slide aggressively at second to break up the DP" },
      { id: "b", text: "Run easy — accept that you're out" },
      { id: "c", text: "Slow down to see if there's a bobble" },
      { id: "d", text: "Run wide of the baseline to confuse the fielder" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect:
      `Run hard. Even if you're out at first, forcing the fielder to ` +
      `rush the throw can save your teammate's out at second. A hard ` +
      `legal slide is the play.`,
    explanationWrong:
      `Slowing up on a double-play ball hands the defense the easiest ` +
      `two outs in baseball. Run hard, slide hard, force the play — ` +
      `that's how you keep the inning alive.`,
    isDynamic: true,
    _context: {
      fielder, runner, runners, direction: "infield", contactType, outs, mode: "batting"
    }
  };
}

// ─── OFFENSIVE: should the lead runner try to score? ──

function generateScoreFromBaseQuestion(
  situation, fielder, runner, runners, outs, direction, contactType
) {
  const fromThird = !!runners.third;
  const distance = fromThird ? "medium" : "long";
  const baseProb = resolveThrowOutProb(
    fielder, runner, distance, contactType
  );
  const shouldGo = baseProb < 0.45 || runner.aggression >= 8;
  const correctId = shouldGo ? "a" : "b";
  const pct = Math.round(baseProb * 100);
  const safePct = 100 - pct;
  const fromBase = fromThird ? "third" : "second";
  const stayBase = fromThird ? "third" : "third"; // runner on 2nd → stops at 3rd

  return {
    situation,
    prompt: `Runner on ${fromBase} — does he try to score on this hit?`,
    choices: [
      { id: "a", text: "Yes — send him home" },
      { id: "b", text: `No — hold at ${stayBase}, don't risk the out at home` },
      { id: "c", text: "Bluff halfway, see if the fielder throws home" },
      { id: "d", text: "Go only if the fielder bobbles it" }
    ],
    correctAnswerId: correctId,
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: shouldGo
      ? `Send him. Against ${fielder.shortName}, ${runner.shortName} is ` +
        `safe at home ${safePct}% of the time. Take the run.`
      : `Hold him. ${fielder.shortName} throws ${runner.shortName} out ` +
        `at home ${pct}% of the time. Don't trade a run for an out — ` +
        `let the next batter drive him in.`,
    explanationWrong: shouldGo
      ? `Holding gives up a run that was there for the taking. ` +
        `${runner.shortName} would have been safe ${safePct}% of the time.`
      : `Sending him here is a low-percentage play. ${fielder.shortName} ` +
        `throws him out ${pct}% of the time. You just traded an inning for an out.`,
    isDynamic: true,
    _context: {
      fielder, runner, runners, direction, contactType, outs, mode: "batting"
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
  rng,
  mode = "pitching",
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

  // Perspective-aware situation framing
  const situation = mode === "batting"
    ? `${runnerDesc}, ${outsDesc}. ${contactDesc} to ${dirDesc}. ` +
      `Fielder: ${fielder.shortName}. Runner: ${runner.shortName}.`
    : `${runnerDesc}, ${outsDesc}. ${contactDesc} to ${dirDesc}. ` +
      `Your fielder: ${fielder.shortName}. Runner: ${runner.shortName}.`;

  // OFFENSIVE branch — player is at the plate / running the bases
  if (mode === "batting") {
    if (playType === "cutoff_decision") {
      return generateScoreFromBaseQuestion(
        situation, fielder, runner, runners,
        outs, direction, contactType
      );
    }
    if (playType === "double_play_read") {
      return generateBreakUpDPQuestion(
        situation, fielder, runner, runners,
        outs, contactType
      );
    }
    if (playType === "advance_or_hold") {
      return generateAdvanceQuestion(
        situation, fielder, runner, runners,
        outs, direction, contactType
      );
    }
    // infield_where (bases empty) — offensive
    return generateStretchQuestion(
      situation, fielder, runner, runners,
      outs, direction, contactType
    );
  }

  // DEFENSIVE branch — player is on the mound / in the field
  if (playType === "cutoff_decision") {
    return generateCutoffQuestion(
      situation, fielder, runner, runners,
      outs, direction, contactType
    );
  }
  if (playType === "advance_or_hold") {
    return generateDefenseAdvanceQuestion(
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
  // infield_where (bases empty) — defensive
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
  rng,
  mode = "pitching",
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

  // The "player's success probability" depends on perspective:
  //   pitching: success = runner is out (high baseProb favors defense)
  //   batting:  success = runner is safe (low baseProb favors offense)
  const playerBaseSuccessProb = mode === "pitching"
    ? baseProb
    : (1 - baseProb);

  // Decision quality shifts the success probability ±25%.
  const playerAdjustedSuccessProb = isCorrect
    ? Math.min(0.90, playerBaseSuccessProb + 0.25)
    : Math.max(0.05, playerBaseSuccessProb - 0.25);

  // RNG draw against the player's success probability.
  const playerSucceeded = rng.next() < playerAdjustedSuccessProb;

  // Convert back to the absolute "isOut" fact for game-state consequences.
  const isOut = mode === "pitching" ? playerSucceeded : !playerSucceeded;

  // IQ delta — keyed off whether the player got what they wanted.
  const iqDelta = isCorrect && playerSucceeded   ?  8
    : isCorrect && !playerSucceeded              ?  3
    : !isCorrect && playerSucceeded              ? -2
    :                                              -5;

  // Game consequence — same in both modes (isOut is the absolute fact)
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
    isCorrect && playerSucceeded   ? "GREAT CALL"
    : isCorrect && !playerSucceeded  ? "GOOD CALL — TOUGH BREAK"
    : !isCorrect && playerSucceeded  ? "GOT LUCKY"
    :                                  "WRONG CALL";

  return {
    isOut,
    playerSucceeded,
    mode,
    iqDelta,
    runsScored,
    runnersAfter,
    outsAdded:    isOut ? 1 : 0,
    resultLabel,
    isCorrect,
    isLucky:      !isCorrect && playerSucceeded,
    isToughBreak: isCorrect && !playerSucceeded,
    // Probabilities surfaced for UI — always expressed as PLAYER success %
    successProb:     Math.round(playerAdjustedSuccessProb * 100),
    baseSuccessProb: Math.round(playerBaseSuccessProb * 100),
    // Legacy aliases (kept for backward-compat with any UI still reading them)
    throwOutProb:    Math.round(playerAdjustedSuccessProb * 100),
    baseThrowOutProb: Math.round(playerBaseSuccessProb * 100),
    fielderName:  fielder.shortName,
    runnerName:   runner.shortName,
  };
}
