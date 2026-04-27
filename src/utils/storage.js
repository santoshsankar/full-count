const KEYS = {
  IQ: 'fullcount_iq',
  HISTORY: 'fullcount_history'
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
