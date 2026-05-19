const KEYS = {
  IQ:      "fullcount_iq",
  HISTORY: "fullcount_history",
  LINEUP:  "fullcount_lineup",
  TEAM:    "fullcount_team",
};

export function loadIQ() {
  const stored = localStorage.getItem(KEYS.IQ);
  return stored ? parseInt(stored, 10) : 100;
}

export function saveIQ(iq) {
  localStorage.setItem(KEYS.IQ, String(iq));
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.HISTORY)) || [];
  } catch { return []; }
}

export function saveRun(runSummary) {
  const history = loadHistory();
  history.unshift(runSummary);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(0, 10)));
}

// ── Lineup persistence ──

export function loadLineup() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.LINEUP)) || null;
  } catch { return null; }
}

export function saveLineup(lineup) {
  localStorage.setItem(KEYS.LINEUP, JSON.stringify(lineup));
}

export function clearLineup() {
  localStorage.removeItem(KEYS.LINEUP);
}

// ── Team name persistence ──

export function loadTeamName() {
  return localStorage.getItem(KEYS.TEAM) || null;
}

export function saveTeamName(name) {
  localStorage.setItem(KEYS.TEAM, name);
}

export function clearTeamName() {
  localStorage.removeItem(KEYS.TEAM);
}
