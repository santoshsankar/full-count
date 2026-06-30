import { useMemo, useState } from "react";
import StatBar from "./StatBar";

const BATTERS_NEEDED = 6;
const VEL_DOTS = { elite: 4, high: 3, medium: 2, low: 1 };
// Stable empty-array reference so the byId useMemo deps don't churn each render.
const EMPTY = [];

// Salary-tier → text color for the "$N M" chip on each card.
const SALARY_TIER_COLOR = {
  20: "var(--px-red)",       // elite, expensive
  15: "var(--px-gold)",      // solid
  10: "var(--px-chalk)",     // role player
  5:  "var(--px-chalk-dim)", // cheap
};

function salaryColor(salary) {
  return SALARY_TIER_COLOR[salary] || "var(--px-chalk)";
}

function SalaryChip({ salary }) {
  return (
    <span className="draft-salary" style={{ color: salaryColor(salary) }}>
      ${salary}M
    </span>
  );
}

function BatterCard({ batter, selected, locked, onToggle, index, pickNumber }) {
  const cls = [
    "draft-batter",
    selected ? "draft-batter--selected px-box-active" : "px-box-inset",
    locked && !selected ? "draft-batter--locked" : "",
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={cls}
      onClick={onToggle}
      disabled={locked && !selected}
      style={{ animationDelay: `${Math.min(index, 20) * 40}ms` }}
    >
      <div className="draft-batter__head">
        <span className="draft-batter__archetype-badge">{batter.archetype}</span>
        <div className="draft-batter__head-right">
          {selected && pickNumber != null && (
            <span className="draft-pick-badge">PICK {pickNumber}</span>
          )}
          {selected && <span className="draft-batter__selected-badge">SELECTED</span>}
          <SalaryChip salary={batter.salary} />
        </div>
      </div>
      <div className="draft-batter__body">
        <div className={`draft-batter__name ${selected ? "draft-batter__name--selected" : ""}`}>
          {batter.displayName || batter.playerName}
        </div>
        <div className="draft-batter__archetype">{batter.archetype}</div>
        <div className="draft-batter__stats">
          <StatBar label="POWER"   value={batter.power}      />
          <StatBar label="CONTACT" value={batter.contact}    />
          <StatBar label="EYE"     value={batter.discipline} />
        </div>
        {batter.tendencies?.[0] && (
          <div className="draft-batter__tendency">{batter.tendencies[0]}</div>
        )}
      </div>
    </button>
  );
}

function PitcherCard({ pitcher, selected, locked, onToggle, index }) {
  const dots = VEL_DOTS[pitcher.velocity] || 2;
  const cls = [
    "draft-pitcher",
    selected ? "draft-pitcher--selected px-box-active" : "px-box-inset",
    locked && !selected ? "draft-pitcher--locked" : "",
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={cls}
      onClick={onToggle}
      disabled={locked && !selected}
      style={{ animationDelay: `${Math.min(index, 20) * 40}ms` }}
    >
      <div className="draft-pitcher__left">
        <div className={`draft-pitcher__name ${selected ? "draft-pitcher__name--selected" : ""}`}>
          {pitcher.displayName || pitcher.playerName}
        </div>
        <div className="draft-pitcher__archetype">{pitcher.archetype}</div>
      </div>
      <div className="draft-pitcher__right">
        <SalaryChip salary={pitcher.salary} />
        <div className="draft-pitcher__velo" title={`Velocity: ${pitcher.velocity}`}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={`draft-pitcher__velo-dot ${i < dots ? "draft-pitcher__velo-dot--on" : ""}`} />
          ))}
        </div>
      </div>
    </button>
  );
}

export default function DraftScreen({ draftPool, onComplete, teamName, cap = 80 }) {
  const batterPool  = draftPool?.batterPool  || EMPTY;
  const pitcherPool = draftPool?.pitcherPool || EMPTY;

  // Fast lookup by unique generated id.
  const byId = useMemo(() => {
    const map = {};
    for (const p of batterPool)  map[p.id] = p;
    for (const p of pitcherPool) map[p.id] = p;
    return map;
  }, [batterPool, pitcherPool]);

  // Selected batter ids in pick order; starter/closer by unique id.
  const [selectedBatters, setSelectedBatters] = useState([]);
  const [starterId, setStarterId] = useState(null);
  const [closerId, setCloserId]   = useState(null);

  const batterCount = selectedBatters.length;
  const pitcherCount = (starterId ? 1 : 0) + (closerId ? 1 : 0);
  const battersDone = batterCount === BATTERS_NEEDED;
  const pitchersDone = !!starterId && !!closerId;
  const canFinish = battersDone && pitchersDone;

  // ── Budget ──
  const spent = useMemo(() => {
    let total = 0;
    for (const id of selectedBatters) total += byId[id]?.salary || 0;
    if (starterId) total += byId[starterId]?.salary || 0;
    if (closerId)  total += byId[closerId]?.salary || 0;
    return total;
  }, [selectedBatters, starterId, closerId, byId]);

  const remaining = cap - spent;

  const leftColor =
    remaining >= 20 ? "var(--px-green)" :
    remaining >= 10 ? "var(--px-gold)"  :
    "var(--px-red)";

  function canAfford(player, isSelected) {
    if (isSelected) return true;
    return (player?.salary || 0) <= remaining;
  }

  function toggleBatter(id) {
    setSelectedBatters(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= BATTERS_NEEDED) return prev;
      if ((byId[id]?.salary || 0) > remaining) return prev; // can't afford
      return [...prev, id];
    });
  }

  function toggleStarter(id) {
    setStarterId(prev => {
      if (prev === id) return null;
      if ((byId[id]?.salary || 0) > remaining) return prev;
      return id;
    });
  }

  function toggleCloser(id) {
    setCloserId(prev => {
      if (prev === id) return null;
      if ((byId[id]?.salary || 0) > remaining) return prev;
      return id;
    });
  }

  function finish() {
    if (!canFinish) return;
    onComplete({
      // Full generated objects, in pick order for batters.
      batters: selectedBatters.map(id => byId[id]),
      starter: byId[starterId],
      closer:  byId[closerId],
    });
  }

  const counterText = useMemo(
    () => `BATTERS ${batterCount}/${BATTERS_NEEDED} · PITCHERS ${pitcherCount}/2`,
    [batterCount, pitcherCount]
  );

  return (
    <div className="draft-screen scanlines crt-vignette">
      <header className="draft-screen__header">
        <h1 className="draft-screen__title">DRAFT YOUR SQUAD</h1>
        <div className={`draft-screen__counter ${battersDone && pitchersDone ? "draft-screen__counter--done" : ""}`}>
          {counterText}
        </div>
      </header>

      {/* Salary cap tracker — sticky below header */}
      <div className="draft-budget">
        <div className="draft-budget__cell">
          <span className="draft-budget__label">BUDGET</span>
          <span className="draft-budget__value">${cap}M</span>
        </div>
        <div className="draft-budget__cell">
          <span className="draft-budget__label">SPENT</span>
          <span className="draft-budget__value">${spent}M</span>
        </div>
        <div className="draft-budget__cell">
          <span className="draft-budget__label">LEFT</span>
          <span className="draft-budget__value" style={{ color: leftColor }}>${remaining}M</span>
        </div>
      </div>

      {teamName && (
        <div className="draft-screen__team-name">FOR {teamName}</div>
      )}

      <section className="draft-screen__section">
        <h2 className="draft-screen__section-label">PICK 6 BATTERS</h2>
        <div className="draft-screen__batters">
          {batterPool.map((b, i) => {
            const selected = selectedBatters.includes(b.id);
            const affordable = canAfford(b, selected);
            const locked = (batterCount >= BATTERS_NEEDED && !selected) || !affordable;
            const pickNumber = selected ? selectedBatters.indexOf(b.id) + 1 : null;
            return (
              <BatterCard
                key={b.id}
                batter={b}
                selected={selected}
                locked={locked}
                onToggle={() => toggleBatter(b.id)}
                index={i}
                pickNumber={pickNumber}
              />
            );
          })}
        </div>
      </section>

      <section className="draft-screen__section">
        <h2 className="draft-screen__section-label">PICK YOUR STARTER</h2>
        <div className="draft-screen__pitchers">
          {pitcherPool.map((p, i) => {
            const selected = starterId === p.id;
            const affordable = canAfford(p, selected);
            const locked = closerId === p.id || !affordable;
            return (
              <PitcherCard
                key={`starter-${p.id}`}
                pitcher={p}
                selected={selected}
                locked={locked}
                onToggle={() => toggleStarter(p.id)}
                index={i}
              />
            );
          })}
        </div>
      </section>

      <section className="draft-screen__section">
        <h2 className="draft-screen__section-label">PICK YOUR CLOSER</h2>
        <div className="draft-screen__pitchers">
          {pitcherPool.map((p, i) => {
            const selected = closerId === p.id;
            const affordable = canAfford(p, selected);
            const locked = starterId === p.id || !affordable;
            return (
              <PitcherCard
                key={`closer-${p.id}`}
                pitcher={p}
                selected={selected}
                locked={locked}
                onToggle={() => toggleCloser(p.id)}
                index={i}
              />
            );
          })}
        </div>
      </section>

      <div className="draft-screen__cta-wrap">
        <button
          type="button"
          className={`draft-screen__cta px-box ${canFinish ? "draft-screen__cta--ready" : "draft-screen__cta--disabled"}`}
          disabled={!canFinish}
          onClick={finish}
        >
          SET THE LINEUP →
        </button>
      </div>
    </div>
  );
}
