const STORAGE_KEY_IQ = "fullcount_iq";
const STORAGE_KEY_HISTORY = "fullcount_history";
const DEFAULT_IQ = 100;
const IQ_FLOOR = 60;
const STREAK_BONUS_AT = 3;
const STREAK_BONUS = 2;

export function loadIQ() {
  const stored = localStorage.getItem(STORAGE_KEY_IQ);
  return stored ? parseInt(stored, 10) : DEFAULT_IQ;
}

export function saveIQ(iq) {
  localStorage.setItem(STORAGE_KEY_IQ, String(Math.max(IQ_FLOOR, iq)));
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || [];
  } catch {
    return [];
  }
}

export function saveRunToHistory(runSummary) {
  const history = loadHistory();
  history.unshift(runSummary);
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 10)));
}

export function computeIQDelta(scenario, isCorrect, streakCount) {
  const base = isCorrect ? scenario.iqDeltaCorrect : scenario.iqDeltaWrong;
  const streakBonus = isCorrect && streakCount > 0 && streakCount % STREAK_BONUS_AT === 0 ? STREAK_BONUS : 0;
  return base + streakBonus;
}

export function applyDelta(currentIQ, delta) {
  return Math.max(IQ_FLOOR, currentIQ + delta);
}

// difficulty: "minors" | "pro" | "allstar"
export function selectRunScenarios(allScenarios, difficulty = "pro") {
  const minors  = shuffle(allScenarios.filter((s) => s.difficulty === "minors"));
  const pro     = shuffle(allScenarios.filter((s) => s.difficulty === "pro"));
  const allstar = shuffle(allScenarios.filter((s) => s.difficulty === "allstar"));

  if (difficulty === "minors") {
    // All 9 minors + 1 pro for a taste of the next level
    return [...minors, ...pro.slice(0, 1)];
  }
  if (difficulty === "allstar") {
    // All 7 all-star + 3 pro to fill out the 10
    return [...shuffle([...pro.slice(0, 3), ...allstar])];
  }
  // Pro: full 10 pro scenarios
  return pro.slice(0, 10);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildRunSummary({ scenarios, answers, startIQ, endIQ }) {
  let runsImpact = 0;
  let bestDecision = null;
  let worstDecision = null;
  let bestImpact = -Infinity;
  let worstImpact = Infinity;

  scenarios.forEach((scenario, idx) => {
    const answer = answers[idx];
    const correct = answer.choiceId === scenario.correctAnswerId;
    const impact = correct ? scenario.runsImpactCorrect : -scenario.runsImpactWrong;
    runsImpact += impact;

    if (impact > bestImpact) {
      bestImpact = impact;
      bestDecision = { scenario, correct, impact };
    }
    if (impact < worstImpact) {
      worstImpact = impact;
      worstDecision = { scenario, correct, impact };
    }
  });

  const correctCount = answers.filter((a, i) => a.choiceId === scenarios[i].correctAnswerId).length;

  return {
    date: new Date().toISOString(),
    startIQ,
    endIQ,
    delta: endIQ - startIQ,
    correctCount,
    total: scenarios.length,
    runsImpact: Math.round(runsImpact * 10) / 10,
    bestDecision,
    worstDecision,
  };
}
