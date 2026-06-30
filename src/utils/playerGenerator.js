// Generative player engine.
//
// Produces uniquely named players from archetype templates. Stats are rolled
// within per-archetype ranges; salary is derived from stat quality. Every
// generated player carries the SAME shape the game engine already reads
// (archetypeId + stat values + the inherited archetype fields), so the
// simulation code is untouched — only the data layer changes.
//
// NOTE on pitcher archetype keys: the static pitcher data (../data/pitchers)
// uses the ids "ground-ball" and "closer". The original spec referenced these
// archetypes as "sinkerball" and "closer-mentality", but generatePitcher must
// look the source archetype up by id, so the range/nickname keys below use the
// real data ids. (Assumption documented in the PR notes.)

import { batters }  from "../data/batters";
import { pitchers } from "../data/pitchers";

// ─── NAME POOLS ─────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Marcus", "Darius", "Carlos", "José", "Tyler",
  "DeShawn", "Ricky", "Andre", "Hank", "Walt",
  "Jimmy", "Luis", "Devon", "Theo", "Manny",
  "Curtis", "Benny", "Ramon", "Trey", "Kai",
  "Orlando", "Felix", "Dante", "Jerome", "Nate",
  "Eddie", "Sammy", "Vic", "Gus", "Alonzo",
  "Pedro", "Ruben", "Malik", "Cody", "Brett",
  "Jonah", "Miles", "Isaac", "Omar", "Drew",
  "Reggie", "Clyde", "Hector", "Aaron", "Zach",
  "Julio", "Willie", "Buck", "Sal", "Cruz"
];

const LAST_NAMES = [
  "Reyes", "Cole", "Whitfield", "Torres", "Bishop",
  "Mathers", "Vargas", "Russo", "Hammond", "Mendez",
  "Carrera", "Tanaka", "Donovan", "Pemberton", "Webb",
  "Santiago", "Brooks", "Delgado", "Nash", "Flynn",
  "Ortega", "Vega", "Castillo", "Monroe", "Banks",
  "Guerrero", "Pena", "Rhodes", "Cross", "Soto",
  "Figueroa", "Garrett", "Ibarra", "Jennings", "Kim",
  "Lara", "Morales", "Nunez", "Okafor", "Price",
  "Quintero", "Rivera", "Salazar", "Tran", "Upton",
  "Valencia", "Washington", "Xavier", "Yates", "Zavala"
];

const NICKNAMES_BY_ARCHETYPE = {
  "power-chaser":       ["Mash", "Blast", "Tank", "Big"],
  "contact-machine":    ["Slick", "Sure", "Steady", "Silk"],
  "disciplined-walker": ["Eye", "Judge", "Selective"],
  "aggressive-hacker":  ["Hack", "Trigger", "Quick"],
  "high-average":       ["Line", "Pure", "Sweet"],
  "streaky-slugger":    ["Boom", "Thunder", "Clutch"],
  "slap-run":           ["Flash", "Blur", "Ghost", "Dash"],
  "dead-pull":          ["Pull", "Yank", "Hook"],
  "patient-veteran":    ["Old", "Wise", "Book"],
  "free-swinger":       ["Wild", "Swing", "Free"],
  "gap-power":          ["Gap", "Double", "Gaps"],
  "lefty-masher":       ["Lefty", "South", "Port"],
  // Pitchers — keyed by the real data ids (ground-ball, closer).
  "power-arm":          ["Heat", "Gas", "Flame"],
  "ground-ball":        ["Sink", "Worm", "Ground"],
  "strikeout-artist":   ["K", "Whiff", "Punch"],
  "finesse-lefty":      ["Crafty", "Slick", "Finesse"],
  "closer":             ["Lock", "Door", "Done"],
  "crafty-veteran":     ["Wily", "Fox", "Chess"],
  "wild-thrower":       ["Wild", "Loose", "Cannon"],
  "offspeed-specialist":["Change", "Slow", "Trick"]
};

// ─── ARCHETYPE STAT RANGES ──────────────────────────────────────────────

const BATTER_RANGES = {
  "power-chaser": {
    contact:    [3, 5],
    power:      [8, 10],
    discipline: [2, 4],
    speed:      [2, 4]
  },
  "contact-machine": {
    contact:    [8, 10],
    power:      [2, 4],
    discipline: [6, 8],
    speed:      [6, 8]
  },
  "disciplined-walker": {
    contact:    [6, 8],
    power:      [4, 6],
    discipline: [9, 10],
    speed:      [4, 6]
  },
  "aggressive-hacker": {
    contact:    [5, 7],
    power:      [6, 8],
    discipline: [1, 3],
    speed:      [4, 6]
  },
  "high-average": {
    contact:    [7, 9],
    power:      [5, 7],
    discipline: [7, 9],
    speed:      [5, 7]
  },
  "streaky-slugger": {
    contact:    [3, 5],
    power:      [9, 10],
    discipline: [3, 5],
    speed:      [2, 4]
  },
  "slap-run": {
    contact:    [7, 9],
    power:      [1, 2],
    discipline: [5, 7],
    speed:      [9, 10]
  },
  "dead-pull": {
    contact:    [5, 7],
    power:      [7, 9],
    discipline: [4, 6],
    speed:      [3, 5]
  },
  "patient-veteran": {
    contact:    [7, 9],
    power:      [4, 6],
    discipline: [8, 10],
    speed:      [3, 5]
  },
  "free-swinger": {
    contact:    [4, 6],
    power:      [6, 8],
    discipline: [1, 3],
    speed:      [4, 6]
  },
  "gap-power": {
    contact:    [6, 8],
    power:      [6, 8],
    discipline: [6, 8],
    speed:      [5, 7]
  },
  "lefty-masher": {
    contact:    [6, 8],
    power:      [7, 9],
    discipline: [5, 7],
    speed:      [4, 6]
  }
};

const PITCHER_RANGES = {
  "power-arm": {
    velocity: "elite",
    control:  [5, 7]
  },
  "ground-ball": {
    velocity: "medium",
    control:  [7, 9]
  },
  "strikeout-artist": {
    velocity: "high",
    control:  [6, 8]
  },
  "finesse-lefty": {
    velocity: "low",
    control:  [9, 10]
  },
  "closer": {
    velocity: "elite",
    control:  [6, 8]
  },
  "crafty-veteran": {
    velocity: "medium",
    control:  [8, 10]
  },
  "wild-thrower": {
    velocity: "elite",
    control:  [2, 4]
  },
  "offspeed-specialist": {
    velocity: "low",
    control:  [7, 9]
  }
};

// Exposed so callers (e.g. the game screen generating CPU rosters) can reason
// about which archetypes exist without re-deriving the range tables.
export const BATTER_ARCHETYPE_IDS  = Object.keys(BATTER_RANGES);
export const PITCHER_ARCHETYPE_IDS = Object.keys(PITCHER_RANGES);

// ─── SALARY CALCULATION ─────────────────────────────────────────────────

function calculateBatterSalary(stats) {
  const overall = (
    stats.contact    * 0.25 +
    stats.power      * 0.25 +
    stats.discipline * 0.25 +
    stats.speed      * 0.25
  );
  if (overall >= 7.5) return 20;
  if (overall >= 6.0) return 15;
  if (overall >= 4.5) return 10;
  return 5;
}

function calculatePitcherSalary(control, velocity) {
  const velocityScore =
    velocity === "elite"  ? 10 :
    velocity === "high"   ?  8 :
    velocity === "medium" ?  5 : 3;
  const overall = (velocityScore + control) / 2;
  if (overall >= 7.5) return 20;
  if (overall >= 6.0) return 15;
  if (overall >= 4.5) return 10;
  return 5;
}

// ─── ROLLERS / ID ───────────────────────────────────────────────────────

function rollStat(range, rng) {
  const [min, max] = range;
  return min + Math.floor(rng.next() * (max - min + 1));
}

function generateId(rng) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return "gen_" + Array.from(
    { length: 8 },
    () => chars[Math.floor(rng.next() * chars.length)]
  ).join("");
}

function rollName(rng) {
  const firstName = FIRST_NAMES[Math.floor(rng.next() * FIRST_NAMES.length)];
  const lastName  = LAST_NAMES[Math.floor(rng.next() * LAST_NAMES.length)];
  return { firstName, lastName };
}

function rollNickname(archetypeId, rng) {
  const pool = NICKNAMES_BY_ARCHETYPE[archetypeId] || [];
  const hasNickname = pool.length > 0 && rng.next() < 0.10;
  return hasNickname ? pool[Math.floor(rng.next() * pool.length)] : null;
}

function buildDisplayName(firstName, lastName, nickname) {
  return nickname
    ? `${firstName} "${nickname}" ${lastName}`
    : `${firstName} ${lastName}`;
}

// ─── GENERATE ONE BATTER ────────────────────────────────────────────────

export function generateBatter(archetypeId, rng) {
  // Source archetype supplies the inherited fields (tendencies, weaknesses,
  // zoneWeakness, pullTendency, chaseRate, blurb) the engine already reads.
  const source = batters.find(b => b.id === archetypeId);
  if (!source) throw new Error(`Unknown batter archetype: ${archetypeId}`);

  const ranges = BATTER_RANGES[archetypeId];
  if (!ranges) throw new Error(`No ranges for archetype: ${archetypeId}`);

  const contact    = rollStat(ranges.contact,    rng);
  const power      = rollStat(ranges.power,       rng);
  const discipline = rollStat(ranges.discipline,  rng);
  const speed      = rollStat(ranges.speed,       rng);

  const { firstName, lastName } = rollName(rng);
  const nickname    = rollNickname(archetypeId, rng);
  const displayName = buildDisplayName(firstName, lastName, nickname);

  const salary = calculateBatterSalary({ contact, power, discipline, speed });

  return {
    id:          generateId(rng),
    archetypeId,
    generatedAt: Date.now(),

    // Identity
    firstName,
    lastName,
    nickname,
    displayName,
    playerName: displayName, // backward compat alias

    // Rolled stats
    contact,
    power,
    discipline,
    speed,

    // Inherited from archetype source
    archetype:    source.archetype,
    blurb:        source.blurb,
    tendencies:   source.tendencies,
    weaknesses:   source.weaknesses,
    zoneWeakness: source.zoneWeakness,
    pullTendency: source.pullTendency,
    chaseRate:    source.chaseRate,

    // Pricing
    salary,

    // Type flag
    isGenerated: true
  };
}

// ─── GENERATE ONE PITCHER ───────────────────────────────────────────────

export function generatePitcher(archetypeId, rng) {
  const source = pitchers.find(p => p.id === archetypeId);
  if (!source) throw new Error(`Unknown pitcher archetype: ${archetypeId}`);

  const ranges = PITCHER_RANGES[archetypeId];
  if (!ranges) throw new Error(`No ranges for archetype: ${archetypeId}`);

  const control  = rollStat(ranges.control, rng);
  const velocity = ranges.velocity;

  const { firstName, lastName } = rollName(rng);
  const nickname    = rollNickname(archetypeId, rng);
  const displayName = buildDisplayName(firstName, lastName, nickname);

  const salary = calculatePitcherSalary(control, velocity);

  return {
    id:          generateId(rng),
    archetypeId,
    generatedAt: Date.now(),

    // Identity
    firstName,
    lastName,
    nickname,
    displayName,
    playerName: displayName,

    // Stats
    control,
    velocity,

    // Inherited
    archetype:   source.archetype,
    arsenal:     source.arsenal,
    tendency:    source.tendency,
    weakness:    source.weakness,
    countLogic:  source.countLogic,

    // Pricing
    salary,

    isGenerated: true
  };
}

// ─── GENERATE DRAFT POOL ────────────────────────────────────────────────

// Default salary cap a drafted team must fit under (mirrors DraftScreen's cap).
// At $100 the cheapest legal team (~$69, max $80) always fits with headroom for
// a couple of star upgrades, so the reroll guard below effectively never fires —
// it stays as a safety net if the cap or salary tiers are ever retuned downward.
const DEFAULT_CAP = 100;

function generatePoolOnce(rng) {
  // 5 batters per archetype = 60 batters total
  const batterPool = BATTER_ARCHETYPE_IDS.flatMap(id =>
    Array.from({ length: 5 }, () => generateBatter(id, rng))
  );

  // 4 pitchers per archetype = 32 pitchers total
  const pitcherPool = PITCHER_ARCHETYPE_IDS.flatMap(id =>
    Array.from({ length: 4 }, () => generatePitcher(id, rng))
  );

  return { batterPool, pitcherPool };
}

// Cost of the cheapest legal team (6 batters + starter + closer). If this
// exceeds the cap, NO valid roster exists and the player would be soft-locked.
function cheapestLegalCost({ batterPool, pitcherPool }) {
  const b = [...batterPool].sort((x, y) => x.salary - y.salary).slice(0, 6);
  const p = [...pitcherPool].sort((x, y) => x.salary - y.salary).slice(0, 2);
  return [...b, ...p].reduce((sum, x) => sum + x.salary, 0);
}

export function generateDraftPool(rng, cap = DEFAULT_CAP) {
  // ~1.5% of pools roll a cheapest-possible team that exceeds the cap. Re-roll
  // those so the player can always assemble a legal roster. With the same rng,
  // each attempt consumes fresh draws, so this stays deterministic per seed.
  let pool = generatePoolOnce(rng);
  for (let attempt = 0; attempt < 20 && cheapestLegalCost(pool) > cap; attempt++) {
    pool = generatePoolOnce(rng);
  }
  return pool;
}

// ─── CPU ON-THE-FLY GENERATION ──────────────────────────────────────────
// Used during a run to populate the opposing side. CPU players are generated
// from archetypes NOT represented in the player's lineup; if every archetype
// is already taken, fall back to the full set.

export function generateCPUBatters(rng, count, excludeArchetypeIds = []) {
  const exclude = new Set(excludeArchetypeIds);
  let pool = BATTER_ARCHETYPE_IDS.filter(id => !exclude.has(id));
  if (pool.length === 0) pool = BATTER_ARCHETYPE_IDS;
  return Array.from({ length: count }, () => {
    const id = pool[Math.floor(rng.next() * pool.length)];
    return generateBatter(id, rng);
  });
}

export function generateCPUPitchers(rng, count, excludeArchetypeIds = []) {
  const exclude = new Set(excludeArchetypeIds);
  let pool = PITCHER_ARCHETYPE_IDS.filter(id => !exclude.has(id));
  if (pool.length === 0) pool = PITCHER_ARCHETYPE_IDS;
  return Array.from({ length: count }, () => {
    const id = pool[Math.floor(rng.next() * pool.length)];
    return generatePitcher(id, rng);
  });
}
