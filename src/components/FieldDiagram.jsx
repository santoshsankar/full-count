// Isometric pixel art baseball diamond
// viewBox 200×160, grid 6×6

const iso = (gx, gy) => ({
  x: 100 + (gx - gy) * 20,
  y:  40 + (gx + gy) * 10,
});

function pts(...pairs) {
  return pairs.map(([gx, gy]) => {
    const p = iso(gx, gy);
    return `${p.x},${p.y}`;
  }).join(" ");
}

const CUBE_H = 6; // height of base cube in CSS px

function Base({ gx, gy, occupied }) {
  const tl = iso(gx - 0.3, gy - 0.3);
  const tr = iso(gx + 0.3, gy - 0.3);
  const br = iso(gx + 0.3, gy + 0.3);
  const bl = iso(gx - 0.3, gy + 0.3);

  const topColor   = occupied ? "var(--px-gold)"        : "var(--px-chalk)";
  const leftColor  = occupied ? "var(--px-gold-dk)"     : "var(--px-chalk-dim)";
  const rightColor = occupied ? "var(--px-gold-shadow)" : "#808060";

  const topPoints   = `${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`;
  const leftPoints  = `${bl.x},${bl.y} ${tl.x},${tl.y} ${tl.x},${tl.y + CUBE_H} ${bl.x},${bl.y + CUBE_H}`;
  const rightPoints = `${br.x},${br.y} ${bl.x},${bl.y} ${bl.x},${bl.y + CUBE_H} ${br.x},${br.y + CUBE_H}`;

  return (
    <g className="field-base" style={{ transition: "all 200ms steps(1)" }}>
      <polygon points={rightPoints} fill={rightColor} />
      <polygon points={leftPoints}  fill={leftColor}  />
      <polygon points={topPoints}   fill={topColor}   />
    </g>
  );
}

export default function FieldDiagram({ runners = {} }) {
  const { first = false, second = false, third = false } = runners;

  // Grass strips — alternating iso rows
  const grassStrips = [0, 1, 2, 3, 4, 5].map((row) => ({
    points: pts(
      [0, row], [6, row], [6, row + 1], [0, row + 1]
    ),
    color: row % 2 === 0 ? "var(--px-grass)" : "var(--px-grass-alt)",
  }));

  // Infield dirt diamond
  const dirtTop   = pts([4, 2], [2, 2], [2, 4], [4, 4]);

  // Warning track border
  const warnTL = iso(0.4, 0.4);
  const warnTR = iso(5.6, 0.4);
  const warnBR = iso(5.6, 5.6);
  const warnBL = iso(0.4, 5.6);
  const warnPts = `${warnTL.x},${warnTL.y} ${warnTR.x},${warnTR.y} ${warnBR.x},${warnBR.y} ${warnBL.x},${warnBL.y}`;

  // Pitcher's mound — small iso rectangle at center
  const moundPts = pts([2.7, 2.7], [3.3, 2.7], [3.3, 3.3], [2.7, 3.3]);

  // Home plate
  const homePt = iso(4, 4);

  // Base paths
  const bpFirst  = `${iso(4,4).x},${iso(4,4).y} ${iso(4,2).x},${iso(4,2).y}`;
  const bpSecond = `${iso(4,2).x},${iso(4,2).y} ${iso(2,2).x},${iso(2,2).y}`;
  const bpThird  = `${iso(2,2).x},${iso(2,2).y} ${iso(2,4).x},${iso(2,4).y}`;
  const bpHome   = `${iso(2,4).x},${iso(2,4).y} ${iso(4,4).x},${iso(4,4).y}`;

  // Foul poles
  const fpLeft  = iso(0, 0);
  const fpRight = iso(6, 0);

  return (
    <svg
      viewBox="0 0 200 160"
      width="200"
      height="160"
      style={{ imageRendering: "pixelated", display: "block", flexShrink: 0 }}
      aria-label="Baseball field diagram"
    >
      {/* Grass */}
      {grassStrips.map((s, i) => (
        <polygon key={i} points={s.points} fill={s.color} />
      ))}

      {/* Warning track */}
      <polygon points={warnPts} fill="none" stroke="var(--px-cream-dk)" strokeWidth="4" />

      {/* Infield dirt */}
      <polygon points={dirtTop} fill="var(--px-dirt-lit)" />

      {/* Base paths */}
      <line x1={iso(4,4).x} y1={iso(4,4).y} x2={iso(4,2).x} y2={iso(4,2).y}
        stroke="var(--px-dirt)" strokeWidth="2" strokeOpacity="0.6" />
      <line x1={iso(4,2).x} y1={iso(4,2).y} x2={iso(2,2).x} y2={iso(2,2).y}
        stroke="var(--px-dirt)" strokeWidth="2" strokeOpacity="0.6" />
      <line x1={iso(2,2).x} y1={iso(2,2).y} x2={iso(2,4).x} y2={iso(2,4).y}
        stroke="var(--px-dirt)" strokeWidth="2" strokeOpacity="0.6" />
      <line x1={iso(2,4).x} y1={iso(2,4).y} x2={iso(4,4).x} y2={iso(4,4).y}
        stroke="var(--px-dirt)" strokeWidth="2" strokeOpacity="0.6" />

      {/* Foul lines */}
      <line x1={iso(4,4).x} y1={iso(4,4).y} x2={iso(0,0).x} y2={iso(0,0).y}
        stroke="var(--px-chalk)" strokeWidth="1" strokeOpacity="0.4" />
      <line x1={iso(4,4).x} y1={iso(4,4).y} x2={iso(6,0).x} y2={iso(6,0).y}
        stroke="var(--px-chalk)" strokeWidth="1" strokeOpacity="0.4" />

      {/* Pitcher's mound */}
      <polygon points={moundPts} fill="var(--px-dirt-dk)" />

      {/* Bases */}
      <Base gx={4} gy={2} occupied={first}  />
      <Base gx={2} gy={2} occupied={second} />
      <Base gx={2} gy={4} occupied={third}  />

      {/* Home plate */}
      <polygon
        points={`${iso(3.8,4).x},${iso(3.8,4).y} ${iso(4,3.8).x},${iso(4,3.8).y} ${iso(4.2,4).x},${iso(4.2,4).y} ${iso(4,4.2).x},${iso(4,4.2).y}`}
        fill="var(--px-chalk)"
      />

      {/* Foul poles */}
      <line x1={fpLeft.x}  y1={fpLeft.y}  x2={fpLeft.x}  y2={fpLeft.y  - 20} stroke="var(--px-gold)" strokeWidth="2" />
      <line x1={fpRight.x} y1={fpRight.y} x2={fpRight.x} y2={fpRight.y - 20} stroke="var(--px-gold)" strokeWidth="2" />
    </svg>
  );
}
