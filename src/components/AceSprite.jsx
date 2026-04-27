// Pixel art sprite — viewBox 48×64, displayed at 120×160 (2.5x scale)
// All shapes on a 4px grid. image-rendering: pixelated.

const C = {
  navyLeft:  "var(--px-navy-left)",
  navyRight: "var(--px-navy-right)",
  navyTop:   "var(--px-navy-top)",
  cream:     "var(--px-cream-left)",
  red:       "var(--px-red)",
  skin:      "var(--px-skin)",
  skinDk:    "var(--px-skin-dk)",
  ink:       "var(--px-ink)",
  goldDk:    "var(--px-gold-dk)",
  gold:      "var(--px-gold)",
};

export default function AceSprite({ animation = "idle", size = 120 }) {
  const height = Math.round(size * (160 / 120));

  return (
    <div
      className={`ace-wrapper ace-wrapper--${animation}`}
      style={{ width: size, height }}
    >
      <svg
        viewBox="0 0 48 64"
        width={size}
        height={height}
        style={{ imageRendering: "pixelated", display: "block", overflow: "visible" }}
        aria-label="Ace — baseball pitcher mascot"
      >
        {/* ground shadow */}
        <ellipse cx="24" cy="62" rx="12" ry="3" fill="rgba(0,0,0,0.3)" />

        {/* ── right leg (standing) ── */}
        <g id="ace-standing-leg">
          <rect x="24" y="36" width="8" height="14" fill={C.cream} />
          {/* right stirrup */}
          <rect x="28" y="44" width="4" height="6" fill={C.red} />
          {/* right cleat */}
          <rect x="22" y="48" width="10" height="4" fill={C.navyRight} />
        </g>

        {/* ── left leg (kick leg) ── */}
        <g id="ace-leg-kick">
          <rect x="16" y="36" width="8" height="14" fill={C.cream} />
          {/* left stirrup */}
          <rect x="16" y="44" width="4" height="6" fill={C.red} />
          {/* left cleat */}
          <rect x="14" y="48" width="10" height="4" fill={C.navyRight} />
        </g>

        {/* ── main body group ── */}
        <g id="ace-body-group">

          {/* glove arm (left) */}
          <g id="ace-glove-arm">
            <rect x="8"  y="20" width="8"  height="4"  fill={C.skin}   />
            {/* glove */}
            <rect x="4"  y="18" width="8"  height="8"  fill={C.goldDk} />
            {/* glove pocket shadow */}
            <rect x="5"  y="19" width="6"  height="6"  fill={C.ink}    style={{ opacity: 0.3 }} />
          </g>

          {/* throwing arm (right) */}
          <g id="ace-throwing-arm">
            <rect x="32" y="20" width="8"  height="4"  fill={C.skin}   />
            {/* ball in hand hint */}
            <rect x="38" y="20" width="4"  height="4"  fill="var(--px-chalk)" />
          </g>

          {/* body */}
          <rect x="16" y="18" width="16" height="18" fill={C.navyLeft}  />
          {/* body right-face depth */}
          <rect x="30" y="19" width="2"  height="16" fill={C.navyRight} />
          {/* belt */}
          <rect x="16" y="34" width="16" height="3"  fill={C.red}       />
          {/* belt buckle */}
          <rect x="22" y="34" width="4"  height="3"  fill={C.gold}      />

          {/* ── head group ── */}
          <g id="ace-head">
            {/* cap brim */}
            <rect x="15" y="7"  width="18" height="3"  fill={C.navyRight} />
            {/* cap dome */}
            <rect x="17" y="1"  width="14" height="7"  fill={C.navyLeft}  />
            {/* cap button */}
            <rect x="23" y="1"  width="2"  height="2"  fill={C.red}       />

            {/* head/face */}
            <rect x="18" y="8"  width="12" height="10" fill={C.skin}      />
            {/* head depth shadow right */}
            <rect x="28" y="9"  width="2"  height="8"  fill={C.skinDk}    />

            {/* left eye */}
            <rect x="20" y="11" width="2"  height="2"  fill={C.ink}       />
            {/* right eye */}
            <rect x="26" y="11" width="2"  height="2"  fill={C.ink}       />

            {/* nose */}
            <rect x="23" y="14" width="2"  height="2"  fill={C.skinDk}    />

            {/* mouth */}
            <rect x="21" y="16" width="6"  height="1"  fill={C.ink}       />
          </g>

        </g>
      </svg>

      <style>{`
        /* transform anchors */
        #ace-body-group    { transform-box: fill-box; transform-origin: center bottom; }
        #ace-head          { transform-box: fill-box; transform-origin: center bottom; }
        #ace-glove-arm     { transform-box: fill-box; transform-origin: right top; }
        #ace-throwing-arm  { transform-box: fill-box; transform-origin: left top; }
        #ace-leg-kick      { transform-box: fill-box; transform-origin: center top; }

        /* ── IDLE ── */
        .ace-wrapper--idle #ace-body-group {
          animation: ace-idle-body 3s steps(4) infinite;
        }
        .ace-wrapper--idle #ace-glove-arm {
          animation: ace-glove-tap 3s steps(2) infinite;
        }
        @keyframes ace-idle-body {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(1px); }
        }
        @keyframes ace-glove-tap {
          0%,80%,100% { transform: translateY(0px); }
          85%         { transform: translateY(2px); }
          90%         { transform: translateY(0px); }
        }

        /* ── PITCH ── */
        .ace-wrapper--pitch #ace-throwing-arm {
          animation: ace-windup 1.2s steps(6) forwards;
        }
        .ace-wrapper--pitch #ace-leg-kick {
          animation: ace-leg-up 1.2s steps(6) forwards;
        }
        .ace-wrapper--pitch #ace-body-group {
          animation: ace-pitch-body 1.2s steps(6) forwards;
        }
        @keyframes ace-windup {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-20deg); }
          55%  { transform: rotate(-50deg) translateY(-4px); }
          80%  { transform: rotate(30deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes ace-leg-up {
          0%,25%  { transform: rotate(0deg); }
          50%     { transform: rotate(-55deg) translateY(-4px); }
          80%     { transform: rotate(0deg); }
          100%    { transform: rotate(0deg); }
        }
        @keyframes ace-pitch-body {
          0%   { transform: rotate(0deg) translateX(0px); }
          30%  { transform: rotate(-8deg) translateX(-2px); }
          60%  { transform: rotate(-12deg) translateX(-3px); }
          80%  { transform: rotate(8deg) translateX(3px); }
          100% { transform: rotate(0deg) translateX(0px); }
        }

        /* ── BAT ── */
        .ace-wrapper--bat #ace-throwing-arm {
          animation: ace-bat-waggle 2s steps(3) infinite;
        }
        .ace-wrapper--bat #ace-standing-leg {
          transform: translateX(-2px);
        }
        @keyframes ace-bat-waggle {
          0%,100% { transform: rotate(-10deg); }
          50%     { transform: rotate(-5deg); }
        }
      `}</style>
    </div>
  );
}
