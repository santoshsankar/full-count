// Seeded deterministic RNG — same seed = identical run
export class SeededRNG {
  constructor(seed) {
    this.seed = seed >>> 0;
  }
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 0xffffffff;
  }
  weightedPick(outcomes) {
    const total = outcomes.reduce((s, o) => s + o.weight, 0);
    let r = this.next() * total;
    for (const o of outcomes) {
      r -= o.weight;
      if (r <= 0) return o.result;
    }
    return outcomes[outcomes.length - 1].result;
  }
  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

// Base outcome weight tables by matchup tier
const BASE_WEIGHTS = {
  EXPLOITS_WEAKNESS: [
    { result: "whiff",        weight: 0.38 },
    { result: "weak_contact", weight: 0.24 },
    { result: "foul",         weight: 0.22 },
    { result: "hard_contact", weight: 0.09 },
    { result: "ball",         weight: 0.07 },
  ],
  NEUTRAL: [
    { result: "whiff",        weight: 0.18 },
    { result: "weak_contact", weight: 0.22 },
    { result: "foul",         weight: 0.25 },
    { result: "hard_contact", weight: 0.25 },
    { result: "ball",         weight: 0.10 },
  ],
  PITCHING_TO_STRENGTH: [
    { result: "whiff",        weight: 0.08 },
    { result: "weak_contact", weight: 0.15 },
    { result: "foul",         weight: 0.20 },
    { result: "hard_contact", weight: 0.48 },
    { result: "ball",         weight: 0.09 },
  ],
  MISTAKE_PITCH: [
    { result: "whiff",        weight: 0.04 },
    { result: "weak_contact", weight: 0.10 },
    { result: "foul",         weight: 0.15 },
    { result: "hard_contact", weight: 0.65 },
    { result: "ball",         weight: 0.06 },
  ],
};

// IQ delta — rewarding decision quality, not luck
const IQ_BY_TIER = {
  EXPLOITS_WEAKNESS:    8,
  NEUTRAL:              5,
  PITCHING_TO_STRENGTH: -3,
  MISTAKE_PITCH:        -6,
};

const ZONE_MAP = {
  "up-in":       { row: 0, col: 0 },
  "up-middle":   { row: 0, col: 1 },
  "up-away":     { row: 0, col: 2 },
  "mid-in":      { row: 1, col: 0 },
  "middle":      { row: 1, col: 1 },
  "mid-away":    { row: 1, col: 2 },
  "low-in":      { row: 2, col: 0 },
  "low-middle":  { row: 2, col: 1 },
  "low-away":    { row: 2, col: 2 },
  "ball":        null,
};

const ADJACENT_ZONES = {
  "up-in":      ["up-middle", "mid-in"],
  "up-middle":  ["up-in", "up-away", "middle"],
  "up-away":    ["up-middle", "mid-away"],
  "mid-in":     ["up-in", "low-in", "middle"],
  "middle":     ["mid-in", "mid-away", "up-middle", "low-middle"],
  "mid-away":   ["up-away", "low-away", "middle"],
  "low-in":     ["mid-in", "low-middle"],
  "low-middle": ["low-in", "low-away", "middle"],
  "low-away":   ["low-middle", "mid-away"],
};

const BREAKING_PITCHES = ["Slider", "Curveball", "Breaking", "Sinker"];
const isBreaking = (pitch) => BREAKING_PITCHES.some(b => pitch.includes(b));

export function getMatchupTier(pitch, location, batter) {
  // Mistake pitch: middle-middle to a good hitter
  if (location === "middle" && (batter.power >= 7 || batter.contact >= 8)) {
    return "MISTAKE_PITCH";
  }

  // Check exploits weakness
  const zw = batter.zoneWeakness;
  let exploits = false;

  if (zw === "away"     && (location === "mid-away" || location === "up-away" || location === "low-away")) exploits = true;
  if (zw === "inside"   && (location === "mid-in"   || location === "up-in"   || location === "low-in"))  exploits = true;
  if (zw === "high"     && location.startsWith("up")) exploits = true;
  if (zw === "low"      && location.startsWith("low")) exploits = true;
  if (zw === "breaking" && isBreaking(pitch)) exploits = true;
  if (batter.chaseRate === "high" && location === "ball") exploits = true;

  if (exploits) return "EXPLOITS_WEAKNESS";

  // Check pitching to strength — opposite of weakness
  if (zw === "away"     && (location === "mid-in"   || location === "up-in"   || location === "low-in"))  return "PITCHING_TO_STRENGTH";
  if (zw === "inside"   && (location === "mid-away" || location === "up-away" || location === "low-away")) return "PITCHING_TO_STRENGTH";
  if (zw === "high"     && location.startsWith("low")) return "PITCHING_TO_STRENGTH";
  if (zw === "low"      && location.startsWith("up"))  return "PITCHING_TO_STRENGTH";
  if (zw === "breaking" && !isBreaking(pitch) && batter.power >= 7) return "PITCHING_TO_STRENGTH";

  return "NEUTRAL";
}

function applyCountModifier(weights, count, batter) {
  const w = weights.map(o => ({ ...o }));
  const { balls, strikes } = count;

  if (strikes > balls) {
    // Pitcher ahead
    const extra = batter.chaseRate === "high" ? 0.10 : 0.06;
    const reduction = batter.discipline >= 8 ? 0.7 : 1.0;
    w.find(o => o.result === "whiff").weight       += extra * reduction;
    w.find(o => o.result === "hard_contact").weight -= 0.06 * reduction;
  } else if (balls > strikes) {
    // Pitcher behind
    const extra = batter.power >= 8 ? 0.15 : 0.10;
    w.find(o => o.result === "hard_contact").weight += extra;
    w.find(o => o.result === "whiff").weight        -= 0.08;
  }
  return w;
}

function applySequenceModifier(weights, pitchHistory, pitch, location) {
  const w = weights.map(o => ({ ...o }));

  if (pitchHistory.length === 0) {
    // First pitch — batter is fresh, reduce whiff, boost hard_contact slightly
    w.find(o => o.result === "whiff").weight        -= 0.05;
    w.find(o => o.result === "hard_contact").weight += 0.05;
    return w;
  }

  const len = pitchHistory.length;
  const prev1 = pitchHistory[len - 1];
  const prev2 = len >= 2 ? pitchHistory[len - 2] : null;

  const sameAsPrev = prev1.pitch === pitch && prev1.location === location;
  const sameAsLastTwo = prev2 && prev2.pitch === pitch && prev2.location === location && sameAsPrev;

  if (sameAsLastTwo) {
    w.find(o => o.result === "hard_contact").weight += 0.25;
    w.find(o => o.result === "whiff").weight        -= 0.20;
  } else if (sameAsPrev) {
    w.find(o => o.result === "hard_contact").weight += 0.12;
    w.find(o => o.result === "whiff").weight        -= 0.10;
  }

  // Setup pitch payoff — opposite type following 2+ same type
  if (len >= 2) {
    const wasBreaking = isBreaking(prev1.pitch) && isBreaking(prev2?.pitch || "");
    const wasFastball = !isBreaking(prev1.pitch) && !isBreaking(prev2?.pitch || "Fastball");
    const nowBreaking = isBreaking(pitch);
    const nowFastball = !isBreaking(pitch);

    if ((wasBreaking && nowFastball) || (wasFastball && nowBreaking)) {
      w.find(o => o.result === "whiff").weight        += 0.15;
      w.find(o => o.result === "weak_contact").weight += 0.08;
    }
  }

  return w;
}

function normalize(weights) {
  const total = weights.reduce((s, o) => s + o.weight, 0);
  return weights.map(o => ({ result: o.result, weight: Math.max(0, o.weight / total) }));
}

const LOC_LABELS = {
  "up-in":      "up and in",
  "up-middle":  "up in the zone",
  "up-away":    "up and away",
  "mid-in":     "in on the hands",
  "middle":     "right down the middle",
  "mid-away":   "on the outside corner",
  "low-in":     "down and in",
  "low-middle": "low in the zone",
  "low-away":   "low and away",
  "ball":       "way off the plate",
};

function locLabel(location) {
  return LOC_LABELS[location] || location.replace("-", " ");
}

function firstName(batter) {
  if (!batter?.playerName) return "the hitter";
  return batter.playerName.split(/\s+/)[0].replace(/"/g, "");
}

// Build a plain-English explanation. `perspective` is "pitching" or "batting".
function buildExplanation(tier, pitch, location, batter, outcome, perspective = "pitching") {
  const where = locLabel(location);
  const name  = firstName(batter);
  const youDid = perspective === "pitching"
    ? `You threw a ${pitch} ${where}.`
    : `He threw you a ${pitch} ${where}.`;

  if (tier === "EXPLOITS_WEAKNESS") {
    if (perspective === "pitching") {
      if (outcome === "hard_contact") {
        return `${youDid} Good pick — ${name} got lucky that time. Stay with that spot.`;
      }
      return `${youDid} That's exactly where ${name} struggles most. Keep going there.`;
    }
    return `${youDid} Smart read — that pitch in that spot is tough on hitters like you.`;
  }

  if (tier === "NEUTRAL") {
    if (perspective === "pitching") {
      return `${youDid} Reasonable pick — no clear advantage either way against ${name}.`;
    }
    return `${youDid} Fine read — neither side gained much there.`;
  }

  if (tier === "PITCHING_TO_STRENGTH") {
    if (perspective === "pitching") {
      return `${youDid} ${name} loves that pitch in that spot. Try working the other side of the zone next time.`;
    }
    return `${youDid} That's right where you like it. Good chance to do damage.`;
  }

  if (tier === "MISTAKE_PITCH") {
    if (perspective === "pitching") {
      if (outcome === "whiff") {
        return `${youDid} You got away with it — middle-middle is the most hittable spot in the zone.`;
      }
      return `${youDid} Middle-middle is the most hittable spot in the zone. Any decent hitter punishes that.`;
    }
    return `${youDid} Right down the middle — that's the pitch you want.`;
  }

  return `${youDid} The result is in.`;
}

export function resolvePitch(pitch, location, batter, count, pitchHistory, rng, perspective = "pitching") {
  const tier = getMatchupTier(pitch, location, batter);

  let weights = [...BASE_WEIGHTS[tier]];
  weights = applyCountModifier(weights, count, batter);
  weights = applySequenceModifier(weights, pitchHistory, pitch, location);
  weights = normalize(weights);

  // "ball" location always resolves to ball outcome
  let outcome = location === "ball"
    ? "ball"
    : rng.weightedPick(weights);

  // An in-zone pitch can never be called a ball — coerce to called_strike (batter took it)
  if (location !== "ball" && outcome === "ball") {
    outcome = "called_strike";
  }

  const baseIQ = IQ_BY_TIER[tier];
  let iqDelta = baseIQ;
  let isLucky = false;

  // Pitcher made a great call but the hitter squared it up anyway — soften the IQ hit
  if (tier === "EXPLOITS_WEAKNESS" && outcome === "hard_contact") {
    iqDelta = 3;
  }
  // Pitcher made a mistake (middle-middle) but got away with it — flag as lucky and soften
  if (tier === "MISTAKE_PITCH" && (outcome === "whiff" || outcome === "foul" || outcome === "called_strike")) {
    iqDelta = -4;
    isLucky = true;
  }

  const runsImpact = iqDelta * 0.1;
  const explanation = buildExplanation(tier, pitch, location, batter, outcome, perspective);

  return { outcome, matchupTier: tier, iqDelta, runsImpact, explanation, isLucky };
}

// Parse "Pitch-location" countLogic string
export function parseCountLogicEntry(entry) {
  if (!entry) return { pitch: "Fastball", location: "middle" };
  const [pitch, loc] = entry.split("-");
  const locationMap = {
    high:   "up-middle",
    away:   "mid-away",
    in:     "mid-in",
    middle: "middle",
    low:    "low-middle",
    low2:   "low-away",
  };
  return {
    pitch: pitch || "Fastball",
    location: locationMap[loc] || "middle"
  };
}

// CPU pitch selection for batting mode
export function getCPUPitch(pitcher, count, rng) {
  const { balls, strikes } = count;
  let pool;
  if (strikes > balls)      pool = pitcher.countLogic.ahead;
  else if (balls > strikes) pool = pitcher.countLogic.behind;
  else                      pool = pitcher.countLogic.even;

  // 15% randomness — pick any entry from the pool
  const idx = Math.floor(rng.next() * pool.length);
  const parsed = parseCountLogicEntry(pool[idx]);

  // Low-control pitchers miss location 20% of the time
  if (pitcher.control <= 4 && rng.next() < 0.20) {
    const adj = ADJACENT_ZONES[parsed.location];
    if (adj) {
      // 50% chance miss goes to adjacent zone, 50% becomes ball
      if (rng.next() < 0.5) {
        parsed.location = adj[Math.floor(rng.next() * adj.length)];
      } else {
        parsed.location = "ball";
      }
    }
  }

  return parsed;
}

// Plain-English explanation for a batting decision
export function buildBattingExplanation(verdict, decision, pitch, location, pitcher) {
  const where = LOC_LABELS[location] || location;
  const pitcherFirst = pitcher?.playerName?.split(/\s+/)[0]?.replace(/"/g, "") || "the pitcher";
  const inZone = location !== "ball";

  if (verdict === "GREAT_SWING") {
    return `${pitcherFirst} threw a ${pitch} ${where}. You read it perfectly — that was the pitch to attack.`;
  }
  if (verdict === "GOOD_SWING") {
    return `${pitcherFirst} threw a ${pitch} ${where}. That was a strike — swinging is a fine call.`;
  }
  if (verdict === "GOOD_TAKE") {
    return `${pitcherFirst} threw a ${pitch} ${where}. Smart take — that pitch was not a strike.`;
  }
  if (verdict === "BAD_TAKE") {
    return `${pitcherFirst} threw a ${pitch} ${where}. That was a strike worth swinging at — you let it go.`;
  }
  if (verdict === "BAD_SWING") {
    return `${pitcherFirst} threw a ${pitch} ${where}. You swung at a pitch off the plate — hard to drive.`;
  }
  if (verdict === "TERRIBLE_SWING") {
    return `${pitcherFirst} threw a ${pitch} ${where}. You chased a pitch way out of the zone — easy out.`;
  }
  return `${pitcherFirst} threw a ${pitch} ${where}. ${decision === "swing" ? "You swung." : "You took it."}`;
}

// IQ delta for batting-mode decisions
export function getBattingIQDelta(decision, location, pitcher, count) {
  const inZone = location !== "ball";
  const wayOutside = location === "ball";

  if (decision === "take") {
    if (!inZone) return { delta: 5, verdict: "GOOD_TAKE", label: "GOOD READ" };
    return { delta: -4, verdict: "BAD_TAKE", label: "WRONG CALL" };
  }

  // swing
  if (!inZone) {
    return wayOutside
      ? { delta: -6, verdict: "TERRIBLE_SWING", label: "WRONG CALL" }
      : { delta: -4, verdict: "BAD_SWING", label: "WRONG CALL" };
  }

  // In zone swing — check if it matched the pitcher's tendency
  const { balls, strikes } = count;
  const poolKey = strikes > balls ? "ahead" : balls > strikes ? "behind" : "even";
  const expectedFirst = parseCountLogicEntry(pitcher.countLogic[poolKey][0]);

  return expectedFirst.location === location
    ? { delta: 8,  verdict: "GREAT_SWING", label: "GREAT CALL" }
    : { delta: 5,  verdict: "GOOD_SWING",  label: "GOOD READ"  };
}

// Resolve ball-in-play outcome (after contact)
export function resolveContact(contactType, rng) {
  if (contactType === "weak_contact") {
    const r = rng.next();
    if (r < 0.70) return "out";
    return "single";
  }
  if (contactType === "hard_contact") {
    const r = rng.next();
    if (r < 0.25) return "out";
    if (r < 0.70) return "single";
    if (r < 0.90) return "extra_base";
    return "home_run";
  }
  return "out";
}

// Advance runners after a hit
export function advanceRunners(runners, hitType) {
  let { first, second, third } = runners;
  let runsScored = 0;

  if (hitType === "single") {
    if (third)  { runsScored++; third  = false; }
    if (second) { third  = true; second = false; }
    if (first)  { second = true; first  = false; }
    first = true; // batter to first
  } else if (hitType === "extra_base") {
    if (third)  { runsScored++; third  = false; }
    if (second) { runsScored++; second = false; }
    if (first)  { third = true; first  = false; }
    second = true; // batter to second
  } else if (hitType === "home_run") {
    if (third)  runsScored++;
    if (second) runsScored++;
    if (first)  runsScored++;
    runsScored++; // batter scores
    first = second = third = false;
  } else if (hitType === "walk") {
    if (third && second && first) { runsScored++; third = false; }
    if (second && first) { third  = second; second = false; }
    if (first)  { second = true; first  = false; }
    first = true;
  }

  return { runners: { first, second, third }, runsScored };
}

// Pick n unique archetypes from an array using rng
export function pickArchetypes(arr, n, rng) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Fill slots cyclically if array is shorter than n
  return Array.from({ length: n }, (_, i) => shuffled[i % shuffled.length]);
}
