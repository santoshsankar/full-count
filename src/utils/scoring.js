export const IQ_BOUNDS = { floor: 60, default: 100 };

export function applyIQDelta(currentIQ, delta) {
  return Math.max(IQ_BOUNDS.floor, currentIQ + delta);
}

export function getStreakBonus(streak) {
  return streak >= 3 ? 2 : 0;
}

export function formatDelta(delta) {
  return delta >= 0 ? `+${delta}` : `${delta}`;
}
