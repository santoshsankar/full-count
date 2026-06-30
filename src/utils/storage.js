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
    const parsed = JSON.parse(localStorage.getItem(KEYS.LINEUP));
    if (!parsed) return null;
    // Migration guard: pre-generator lineups stored archetype-id strings
    // instead of full generated player objects. Discard those so the user
    // re-drafts rather than crashing on undefined player fields.
    const b = parsed.batters;
    if (!Array.isArray(b) || b.some(x => typeof x !== "object" || x == null)) {
      return null;
    }
    return parsed;
  } catch { return null; }
}

// Stores the full generated player objects (~500 bytes each, ~4KB total),
// not just archetype ids — well within localStorage limits.
export function saveLineup(lineup) {
  const withMeta = { ...lineup, savedAt: lineup.savedAt || Date.now() };
  localStorage.setItem(KEYS.LINEUP, JSON.stringify(withMeta));
}

export function clearLineup() {
  // No draft pool is cached in localStorage (it lives in App state only), so
  // there is nothing else to clear here.
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
