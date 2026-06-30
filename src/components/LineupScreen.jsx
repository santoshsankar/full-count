import { useMemo, useState } from "react";

const SLOT_COUNT = 6;
const EMPTY = [];

export default function LineupScreen({ picks, onComplete }) {
  // picks.batters are full generated player objects (length SLOT_COUNT).
  const draftedBatters = picks?.batters || EMPTY;
  const byId = useMemo(
    () => Object.fromEntries(draftedBatters.map(b => [b.id, b])),
    [draftedBatters]
  );

  // slots: array of batter id | null, length SLOT_COUNT
  const [slots, setSlots] = useState(() => Array(SLOT_COUNT).fill(null));
  const [activeSlot, setActiveSlot] = useState(0); // start with slot 1 active

  const placedSet = new Set(slots.filter(Boolean));
  const allPlaced = slots.every(Boolean);

  function selectSlot(idx) {
    // Tapping a filled slot clears it
    if (slots[idx]) {
      const next = [...slots];
      next[idx] = null;
      setSlots(next);
      setActiveSlot(idx);
      return;
    }
    setActiveSlot(idx);
  }

  function placePlayer(id) {
    if (placedSet.has(id)) return;          // already placed
    if (activeSlot == null) return;
    if (slots[activeSlot]) return;          // active slot somehow filled
    const next = [...slots];
    next[activeSlot] = id;
    setSlots(next);
    // Advance to next empty slot, if any
    const nextEmpty = next.findIndex(s => s == null);
    setActiveSlot(nextEmpty === -1 ? null : nextEmpty);
  }

  function finish() {
    if (!allPlaced) return;
    onComplete({
      batters: slots.map(id => byId[id]),   // ordered full objects, slot 1-6
      starter: picks.starter,
      closer:  picks.closer,
    });
  }

  return (
    <div className="lineup-screen scanlines crt-vignette">
      <header className="lineup-screen__header">
        <h1 className="lineup-screen__title">SET YOUR LINEUP</h1>
        <p className="lineup-screen__subtitle">
          Tap a slot, then tap a player to fill it.
        </p>
      </header>

      <section className="lineup-screen__slots">
        {slots.map((id, idx) => {
          const batter = id ? byId[id] : null;
          const isActive = idx === activeSlot;
          const cls = [
            "lineup-slot",
            id ? "lineup-slot--filled px-box" : "px-box-inset",
            isActive ? "lineup-slot--active" : "",
          ].filter(Boolean).join(" ");
          return (
            <button
              key={idx}
              type="button"
              className={cls}
              onClick={() => selectSlot(idx)}
            >
              <span className="lineup-slot__num">{idx + 1}</span>
              {batter ? (
                <>
                  <span className="lineup-slot__name">{batter.displayName || batter.playerName}</span>
                  <span className="lineup-slot__archetype">{batter.archetype.toUpperCase()}</span>
                </>
              ) : (
                <span className="lineup-slot__placeholder">
                  {isActive ? "PICK A PLAYER" : "TAP A PLAYER"}
                </span>
              )}
            </button>
          );
        })}
      </section>

      <section className="lineup-screen__pool">
        <h2 className="lineup-screen__pool-label">YOUR DRAFTED PLAYERS</h2>
        <div className="lineup-screen__pool-list">
          {draftedBatters.map(batter => {
            const placed = placedSet.has(batter.id);
            const cls = [
              "lineup-pool-row",
              placed ? "lineup-pool-row--placed" : "px-box-inset",
            ].filter(Boolean).join(" ");
            return (
              <button
                key={batter.id}
                type="button"
                className={cls}
                onClick={() => placePlayer(batter.id)}
                disabled={placed || activeSlot == null}
              >
                <span className="lineup-pool-row__name">{batter.displayName || batter.playerName}</span>
                <span className="lineup-pool-row__archetype">{batter.archetype}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="lineup-screen__cta-wrap">
        <button
          type="button"
          className={`lineup-screen__cta px-box ${allPlaced ? "lineup-screen__cta--ready" : "lineup-screen__cta--disabled"}`}
          disabled={!allPlaced}
          onClick={finish}
        >
          TAKE THE FIELD →
        </button>
      </div>
    </div>
  );
}
