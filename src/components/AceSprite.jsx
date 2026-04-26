export default function AceSprite({ animation = "idle", size = 120 }) {
  const h = Math.round(180 * size / 120);

  return (
    <div
      className={`ace-sprite-wrap ace-anim-${animation}`}
      style={{ width: size, height: h, display: "inline-block", flexShrink: 0 }}
    >
      <style>{`
        /* ── palette ── */
        :root {
          --s-outline: #111;
          --s-skin:    #d4956a;
          --s-skind:   #b8724a;
          --s-navy:    #0d1f3c;
          --s-navym:   #1a3a5c;
          --s-white:   #f0ece0;
          --s-red:     #c41230;
          --s-cleat:   #1e1e1e;
          --s-gold:    #c8a000;
        }

        /* ── shared animation setup ── */
        .ace-anim-idle  #ace-body,
        .ace-anim-pitch #ace-body,
        .ace-anim-bat   #ace-body         { transform-box: fill-box; transform-origin: center bottom; }

        .ace-anim-idle  #ace-glove-arm,
        .ace-anim-pitch #ace-glove-arm,
        .ace-anim-bat   #ace-glove-arm    { transform-box: fill-box; transform-origin: right top; }

        .ace-anim-idle  #ace-throwing-arm,
        .ace-anim-pitch #ace-throwing-arm,
        .ace-anim-bat   #ace-throwing-arm { transform-box: fill-box; transform-origin: left top; }

        .ace-anim-idle  #ace-leg-kick,
        .ace-anim-pitch #ace-leg-kick,
        .ace-anim-bat   #ace-leg-kick     { transform-box: fill-box; transform-origin: center top; }

        .ace-anim-idle  #ace-head,
        .ace-anim-pitch #ace-head,
        .ace-anim-bat   #ace-head         { transform-box: fill-box; transform-origin: center bottom; }

        /* ────────── IDLE ────────── */
        .ace-anim-idle #ace-body      { animation: aceIdleBody 3s ease-in-out infinite; }
        .ace-anim-idle #ace-glove-arm { animation: aceIdleGlove 3s ease-in-out infinite; }
        .ace-anim-idle #ace-head      { animation: aceIdleHead 4s ease-in-out infinite; }

        @keyframes aceIdleBody {
          0%,100% { transform: translateX(0); }
          35%     { transform: translateX(-2px); }
          70%     { transform: translateX(2px); }
        }
        @keyframes aceIdleGlove {
          0%,72%,100% { transform: translateY(0); }
          82%          { transform: translateY(5px); }
          90%          { transform: translateY(2px); }
        }
        @keyframes aceIdleHead {
          0%,100% { transform: rotate(0deg); }
          50%     { transform: rotate(-2deg); }
        }

        /* ────────── PITCH ────────── */
        .ace-anim-pitch #ace-body         { animation: acePitchBody 1.2s ease-in-out forwards; }
        .ace-anim-pitch #ace-throwing-arm { animation: acePitchArm  1.2s ease-in-out forwards; }
        .ace-anim-pitch #ace-leg-kick     { animation: acePitchLeg  1.2s ease-in-out forwards; }
        .ace-anim-pitch #ace-glove-arm    { animation: acePitchGlove 1.2s ease-in-out forwards; }
        .ace-anim-pitch #ace-head         { animation: acePitchHead 1.2s ease-in-out forwards; }

        @keyframes acePitchBody {
          0%   { transform: rotate(0deg) translateX(0); }
          20%  { transform: rotate(-7deg) translateX(-4px); }
          55%  { transform: rotate(-11deg) translateX(-6px); }
          75%  { transform: rotate(9deg) translateX(6px); }
          90%  { transform: rotate(3deg) translateX(2px); }
          100% { transform: rotate(0deg) translateX(0); }
        }
        @keyframes acePitchArm {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-28deg); }
          58%  { transform: rotate(-55deg); }
          76%  { transform: rotate(38deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes acePitchLeg {
          0%   { transform: rotate(0deg) translateY(0); }
          18%  { transform: rotate(12deg) translateY(-6px); }
          52%  { transform: rotate(62deg) translateY(-32px); }
          82%  { transform: rotate(4deg) translateY(-2px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes acePitchGlove {
          0%   { transform: rotate(0deg) translateY(0); }
          40%  { transform: rotate(18deg) translateY(-10px); }
          75%  { transform: rotate(-12deg) translateY(6px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes acePitchHead {
          0%   { transform: rotate(0deg); }
          48%  { transform: rotate(-9deg); }
          78%  { transform: rotate(7deg); }
          100% { transform: rotate(0deg); }
        }

        /* ────────── BAT ────────── */
        .ace-anim-bat #ace-body         { animation: aceBatBody  2s ease-in-out infinite; }
        .ace-anim-bat #ace-throwing-arm { animation: aceBatArm   2s ease-in-out infinite; }
        .ace-anim-bat #ace-glove-arm    { animation: aceBatGlove 2s ease-in-out infinite; }
        .ace-anim-bat #ace-head         { animation: aceBatHead  2s ease-in-out infinite; }

        @keyframes aceBatBody {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%     { transform: translateY(3px) rotate(2deg); }
        }
        @keyframes aceBatArm {
          0%,100% { transform: rotate(-4deg); }
          50%     { transform: rotate(4deg); }
        }
        @keyframes aceBatGlove {
          0%,100% { transform: rotate(3deg); }
          50%     { transform: rotate(-3deg); }
        }
        @keyframes aceBatHead {
          0%,100% { transform: rotate(3deg); }
          50%     { transform: rotate(-2deg); }
        }
      `}</style>

      <svg
        viewBox="0 0 120 180"
        width={size}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="The Ace — fictional pitcher mascot"
        style={{ overflow: "visible", display: "block" }}
      >
        {/* ground shadow */}
        <ellipse cx="57" cy="176" rx="30" ry="5" fill="rgba(0,0,0,0.22)" />

        {/* ═══ STANDING LEG (right, plant foot) — behind body ═══ */}
        <g id="ace-standing-leg">
          {/* thigh */}
          <polygon points="57,122 73,122 71,154 55,154"
            fill="var(--s-white)" stroke="var(--s-outline)" strokeWidth="3" />
          {/* shin */}
          <polygon points="56,152 71,152 69,172 54,172"
            fill="var(--s-white)" stroke="var(--s-outline)" strokeWidth="3" />
          {/* stirrup stripe */}
          <rect x="56" y="160" width="13" height="6" rx="1" fill="var(--s-red)" />
          {/* cleat */}
          <polygon points="50,170 76,170 78,178 48,178"
            fill="var(--s-cleat)" stroke="var(--s-outline)" strokeWidth="2.5" />
          <rect x="52" y="174" width="5" height="5" rx="1" fill="#3a3a3a" />
          <rect x="60" y="174" width="5" height="5" rx="1" fill="#3a3a3a" />
          <rect x="68" y="174" width="5" height="5" rx="1" fill="#3a3a3a" />
        </g>

        {/* ═══ KICK LEG (left leg — animates during pitch) ═══ */}
        <g id="ace-leg-kick">
          {/* thigh */}
          <polygon points="41,122 57,122 55,154 39,154"
            fill="var(--s-white)" stroke="var(--s-outline)" strokeWidth="3" />
          {/* shin */}
          <polygon points="40,152 55,152 53,172 38,172"
            fill="var(--s-white)" stroke="var(--s-outline)" strokeWidth="3" />
          {/* stirrup */}
          <rect x="40" y="160" width="13" height="6" rx="1" fill="var(--s-red)" />
          {/* cleat */}
          <polygon points="34,170 60,170 62,178 32,178"
            fill="var(--s-cleat)" stroke="var(--s-outline)" strokeWidth="2.5" />
          <rect x="36" y="174" width="5" height="5" rx="1" fill="#3a3a3a" />
          <rect x="44" y="174" width="5" height="5" rx="1" fill="#3a3a3a" />
          <rect x="52" y="174" width="5" height="5" rx="1" fill="#3a3a3a" />
        </g>

        {/* ═══ BODY GROUP ═══ */}
        <g id="ace-body">

          {/* ── GLOVE ARM (left / non-throwing) ── */}
          <g id="ace-glove-arm">
            {/* upper arm — slopes left and down from shoulder */}
            <polygon points="22,68 38,68 30,94 14,94"
              fill="var(--s-navy)" stroke="var(--s-outline)" strokeWidth="3" />
            {/* forearm — continues down-left */}
            <polygon points="12,92 28,92 20,114 4,114"
              fill="var(--s-navy)" stroke="var(--s-outline)" strokeWidth="3" />
            {/* glove mitt — chunky oval */}
            <ellipse cx="5" cy="122" rx="13" ry="11"
              fill="var(--s-red)" stroke="var(--s-outline)" strokeWidth="3" />
            <ellipse cx="5" cy="122" rx="8" ry="7" fill="#8b0010" />
            {/* glove lacing / finger ridges */}
            <line x1="-1" y1="115" x2="-3" y2="109" stroke="var(--s-outline)" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="5"  y1="113" x2="4"  y2="107" stroke="var(--s-outline)" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="12" y1="114" x2="13" y2="108" stroke="var(--s-outline)" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          {/* ── THROWING ARM (right) ── */}
          <g id="ace-throwing-arm">
            {/* upper arm — from right shoulder going right + slightly down */}
            <polygon points="86,68 100,68 110,88 96,88"
              fill="var(--s-navy)" stroke="var(--s-outline)" strokeWidth="3" />
            {/* forearm — from elbow forward and slightly up */}
            <polygon points="104,86 116,86 120,74 108,74"
              fill="var(--s-navym)" stroke="var(--s-outline)" strokeWidth="3" />
            {/* hand */}
            <circle cx="119" cy="70" r="9"
              fill="var(--s-skin)" stroke="var(--s-outline)" strokeWidth="3" />
            {/* baseball in grip */}
            <circle cx="119" cy="70" r="6"
              fill="var(--s-white)" stroke="var(--s-outline)" strokeWidth="1.8" />
            <path d="M115,67 Q117,65 119,67" stroke="var(--s-red)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M119,72 Q121,74 123,72" stroke="var(--s-red)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* ── TORSO / JERSEY — wide shoulders, tapered waist ── */}
          {/* main body */}
          <polygon points="20,66 96,66 90,122 26,122"
            fill="var(--s-navy)" stroke="var(--s-outline)" strokeWidth="3" />
          {/* chest shading panel */}
          <polygon points="32,68 82,68 78,114 38,114"
            fill="var(--s-navym)" />
          {/* V-neck collar */}
          <polygon points="46,66 56,82 66,66"
            fill="var(--s-white)" stroke="var(--s-outline)" strokeWidth="2.5" />
          {/* undershirt visible at collar */}
          <polygon points="49,66 56,78 63,66" fill="var(--s-white)" />

          {/* ── BELT ── */}
          <rect x="26" y="118" width="64" height="9" rx="2"
            fill="var(--s-red)" stroke="var(--s-outline)" strokeWidth="2.5" />
          {/* buckle */}
          <rect x="52" y="119" width="12" height="7" rx="1"
            fill="var(--s-gold)" stroke="var(--s-outline)" strokeWidth="1.5" />
          <rect x="55" y="121" width="6" height="3" rx="0.5" fill="var(--s-outline)" opacity="0.3" />

          {/* ── HEAD GROUP ── */}
          <g id="ace-head">
            {/* neck */}
            <rect x="50" y="60" width="18" height="12" rx="4"
              fill="var(--s-skin)" stroke="var(--s-outline)" strokeWidth="2.5" />

            {/* face — slightly rightward oval */}
            <ellipse cx="58" cy="40" rx="21" ry="23"
              fill="var(--s-skin)" stroke="var(--s-outline)" strokeWidth="3" />

            {/* jaw / chin shadow */}
            <ellipse cx="58" cy="52" rx="15" ry="11" fill="var(--s-skind)" opacity="0.28" />

            {/* right ear */}
            <ellipse cx="79" cy="40" rx="4" ry="7"
              fill="var(--s-skin)" stroke="var(--s-outline)" strokeWidth="2.5" />
            <ellipse cx="79" cy="40" rx="2" ry="4" fill="var(--s-skind)" opacity="0.45" />

            {/* eyebrows — thick pixel style */}
            <rect x="43" y="29" width="10" height="4" rx="1.5" fill="var(--s-outline)" opacity="0.85" />
            <rect x="59" y="29" width="10" height="4" rx="1.5" fill="var(--s-outline)" opacity="0.85" />

            {/* eyes — chunky 8x8 pixel blocks */}
            <rect x="43" y="34" width="9" height="9" rx="2" fill="var(--s-outline)" />
            <rect x="59" y="34" width="9" height="9" rx="2" fill="var(--s-outline)" />
            {/* eye shine */}
            <rect x="44" y="35" width="3" height="3" rx="0.5" fill="var(--s-white)" />
            <rect x="60" y="35" width="3" height="3" rx="0.5" fill="var(--s-white)" />

            {/* nose — small rect */}
            <rect x="56" y="46" width="5" height="5" rx="1.5" fill="var(--s-skind)" opacity="0.7" />

            {/* mouth — determined set, straight line */}
            <path d="M47,56 L67,56"
              stroke="var(--s-outline)" strokeWidth="3" strokeLinecap="round" />

            {/* ── CAP ── */}
            <g id="ace-cap">
              {/* dome — main rounded shape */}
              <ellipse cx="57" cy="24" rx="22" ry="17"
                fill="var(--s-navy)" stroke="var(--s-outline)" strokeWidth="3" />
              {/* dome bottom fill — flattens the ellipse base */}
              <rect x="34" y="30" width="46" height="14" fill="var(--s-navy)" />
              {/* cap base / sweatband line */}
              <line x1="34" y1="42" x2="80" y2="42"
                stroke="var(--s-outline)" strokeWidth="3" />
              {/* crown seam */}
              <line x1="57" y1="8" x2="57" y2="32"
                stroke="var(--s-navym)" strokeWidth="2" />
              {/* cap button */}
              <circle cx="57" cy="8" r="4.5"
                fill="var(--s-red)" stroke="var(--s-outline)" strokeWidth="2.5" />
              {/* brim — extends left (character faces slightly right) */}
              <polygon points="34,38 44,34 44,42 18,42 16,49 36,49"
                fill="var(--s-navy)" stroke="var(--s-outline)" strokeWidth="3" />
              {/* brim underside shading */}
              <polygon points="36,42 44,42 42,49 34,49" fill="var(--s-navym)" opacity="0.7" />
            </g>
          </g>

        </g>{/* end #ace-body */}
      </svg>
    </div>
  );
}
