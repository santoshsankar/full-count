import { useMemo, useState } from "react";
import { batters as allBatters } from "../data/batters";
import { pitchers as allPitchers } from "../data/pitchers";
import StatBar from "./StatBar";

const BATTERS_NEEDED = 6;
const VEL_DOTS = { elite: 4, high: 3, medium: 2, low: 1 };

function BatterCard({ batter, selected, locked, onToggle, index }) {
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
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="draft-batter__head">
        <span className="draft-batter__archetype-badge">{batter.archetype}</span>
        {selected && <span className="draft-batter__selected-badge">SELECTED</span>}
      </div>
      <div className="draft-batter__body">
        <div className={`draft-batter__name ${selected ? "draft-batter__name--selected" : ""}`}>
          {batter.playerName}
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
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="draft-pitcher__left">
        <div className={`draft-pitcher__name ${selected ? "draft-pitcher__name--selected" : ""}`}>
          {pitcher.playerName}
        </div>
        <div className="draft-pitcher__archetype">{pitcher.archetype}</div>
      </div>
      <div className="draft-pitcher__velo" title={`Velocity: ${pitcher.velocity}`}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`draft-pitcher__velo-dot ${i < dots ? "draft-pitcher__velo-dot--on" : ""}`} />
        ))}
      </div>
    </button>
  );
}

export default function DraftScreen({ onComplete, teamName }) {
  // Selected batter ids in pick order
  const [selectedBatters, setSelectedBatters] = useState([]);
  const [starterId, setStarterId] = useState(null);
  const [closerId, setCloserId]   = useState(null);

  const batterCount = selectedBatters.length;
  const pitcherCount = (starterId ? 1 : 0) + (closerId ? 1 : 0);
  const battersDone = batterCount === BATTERS_NEEDED;
  const pitchersDone = !!starterId && !!closerId;
  const canFinish = battersDone && pitchersDone;

  function toggleBatter(id) {
    setSelectedBatters(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= BATTERS_NEEDED) return prev;
      return [...prev, id];
    });
  }

  function toggleStarter(id) {
    setStarterId(prev => (prev === id ? null : id));
  }

  function toggleCloser(id) {
    setCloserId(prev => (prev === id ? null : id));
  }

  function finish() {
    if (!canFinish) return;
    onComplete({
      batters: selectedBatters,
      starter: starterId,
      closer:  closerId,
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

      {teamName && (
        <div className="draft-screen__team-name">FOR {teamName}</div>
      )}

      <section className="draft-screen__section">
        <h2 className="draft-screen__section-label">PICK 6 BATTERS</h2>
        <div className="draft-screen__batters">
          {allBatters.map((b, i) => {
            const selected = selectedBatters.includes(b.id);
            const locked = batterCount >= BATTERS_NEEDED && !selected;
            return (
              <BatterCard
                key={b.id}
                batter={b}
                selected={selected}
                locked={locked}
                onToggle={() => toggleBatter(b.id)}
                index={i}
              />
            );
          })}
        </div>
      </section>

      <section className="draft-screen__section">
        <h2 className="draft-screen__section-label">PICK YOUR STARTER</h2>
        <div className="draft-screen__pitchers">
          {allPitchers.map((p, i) => (
            <PitcherCard
              key={`starter-${p.id}`}
              pitcher={p}
              selected={starterId === p.id}
              locked={closerId === p.id}
              onToggle={() => toggleStarter(p.id)}
              index={i}
            />
          ))}
        </div>
      </section>

      <section className="draft-screen__section">
        <h2 className="draft-screen__section-label">PICK YOUR CLOSER</h2>
        <div className="draft-screen__pitchers">
          {allPitchers.map((p, i) => (
            <PitcherCard
              key={`closer-${p.id}`}
              pitcher={p}
              selected={closerId === p.id}
              locked={starterId === p.id}
              onToggle={() => toggleCloser(p.id)}
              index={i}
            />
          ))}
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
