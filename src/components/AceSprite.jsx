// Pixel grid: 1 unit = 4px SVG. ViewBox 120×180 = 30×45 pixel grid.
// Design inspired by SNES baseball — big head, barrel chest, chunky limbs.

export default function AceSprite({ animation = "idle", size = 120 }) {
  const h = Math.round(180 * size / 120);

  return (
    <div
      className={`ace-sprite-wrap ace-anim-${animation}`}
      style={{ width: size, height: h, display: "inline-block", flexShrink: 0 }}
    >
      <style>{`
        /* palette */
        .ace-svg { --k: #111; --sk: #d4956a; --skd: #a06040; --nv: #0d1f3c;
                   --nm: #1a3a5c; --wh: #f0ece0; --re: #c41230; --cl: #181818;
                   --gl: #9b5520; --gld: #6b3510; --au: #c8a000; }

        /* pivot anchors */
        .ace-anim-idle  #ace-body,
        .ace-anim-pitch #ace-body,
        .ace-anim-bat   #ace-body        { transform-box:fill-box; transform-origin:center bottom; }
        .ace-anim-idle  #ace-glove-arm,
        .ace-anim-pitch #ace-glove-arm,
        .ace-anim-bat   #ace-glove-arm   { transform-box:fill-box; transform-origin:right top; }
        .ace-anim-idle  #ace-throwing-arm,
        .ace-anim-pitch #ace-throwing-arm,
        .ace-anim-bat   #ace-throwing-arm{ transform-box:fill-box; transform-origin:left top; }
        .ace-anim-idle  #ace-leg-kick,
        .ace-anim-pitch #ace-leg-kick,
        .ace-anim-bat   #ace-leg-kick    { transform-box:fill-box; transform-origin:center top; }
        .ace-anim-idle  #ace-head,
        .ace-anim-pitch #ace-head,
        .ace-anim-bat   #ace-head        { transform-box:fill-box; transform-origin:center bottom; }

        /* bat only shows in batting stance */
        #ace-bat { opacity:0; }
        .ace-anim-bat #ace-bat { opacity:1; }

        /* ── IDLE ── */
        .ace-anim-idle #ace-body      { animation: i-body  3s ease-in-out infinite; }
        .ace-anim-idle #ace-glove-arm { animation: i-glove 3s ease-in-out infinite; }
        .ace-anim-idle #ace-head      { animation: i-head  4s ease-in-out infinite; }
        @keyframes i-body  { 0%,100%{transform:translateX(0)}  38%{transform:translateX(-2px)} 72%{transform:translateX(2px)} }
        @keyframes i-glove { 0%,74%,100%{transform:translateY(0)} 84%{transform:translateY(6px)} 92%{transform:translateY(3px)} }
        @keyframes i-head  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-2deg)} }

        /* ── PITCH ── */
        .ace-anim-pitch #ace-body         { animation: p-body  1.2s ease-in-out forwards; }
        .ace-anim-pitch #ace-throwing-arm { animation: p-arm   1.2s ease-in-out forwards; }
        .ace-anim-pitch #ace-leg-kick     { animation: p-leg   1.2s ease-in-out forwards; }
        .ace-anim-pitch #ace-glove-arm    { animation: p-glove 1.2s ease-in-out forwards; }
        .ace-anim-pitch #ace-head         { animation: p-head  1.2s ease-in-out forwards; }
        @keyframes p-body  { 0%{transform:rotate(0)translateX(0)} 22%{transform:rotate(-8deg)translateX(-5px)} 55%{transform:rotate(-12deg)translateX(-7px)} 76%{transform:rotate(10deg)translateX(7px)} 92%{transform:rotate(3deg)translateX(2px)} 100%{transform:rotate(0)translateX(0)} }
        @keyframes p-arm   { 0%{transform:rotate(0)} 28%{transform:rotate(-32deg)} 60%{transform:rotate(-58deg)} 78%{transform:rotate(42deg)} 100%{transform:rotate(0)} }
        @keyframes p-leg   { 0%{transform:rotate(0)translateY(0)} 20%{transform:rotate(14deg)translateY(-8px)} 54%{transform:rotate(66deg)translateY(-36px)} 84%{transform:rotate(4deg)translateY(-2px)} 100%{transform:rotate(0)translateY(0)} }
        @keyframes p-glove { 0%{transform:rotate(0)translateY(0)} 42%{transform:rotate(20deg)translateY(-12px)} 76%{transform:rotate(-14deg)translateY(7px)} 100%{transform:rotate(0)translateY(0)} }
        @keyframes p-head  { 0%{transform:rotate(0)} 50%{transform:rotate(-10deg)} 80%{transform:rotate(8deg)} 100%{transform:rotate(0)} }

        /* ── BAT ── */
        .ace-anim-bat #ace-body         { animation: b-body  2s ease-in-out infinite; }
        .ace-anim-bat #ace-throwing-arm { animation: b-arm   2s ease-in-out infinite; }
        .ace-anim-bat #ace-glove-arm    { animation: b-glove 2s ease-in-out infinite; }
        .ace-anim-bat #ace-head         { animation: b-head  2s ease-in-out infinite; }
        .ace-anim-bat #ace-bat          { animation: b-bat   2s ease-in-out infinite; transform-box:fill-box; transform-origin:bottom center; }
        @keyframes b-body  { 0%,100%{transform:translateY(0)rotate(-2deg)} 50%{transform:translateY(3px)rotate(2deg)} }
        @keyframes b-arm   { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
        @keyframes b-glove { 0%,100%{transform:rotate(4deg)} 50%{transform:rotate(-4deg)} }
        @keyframes b-head  { 0%,100%{transform:rotate(3deg)} 50%{transform:rotate(-2deg)} }
        @keyframes b-bat   { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
      `}</style>

      <svg className="ace-svg"
        viewBox="0 0 120 180" width={size} height={h}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="The Ace — fictional pitcher mascot"
        shapeRendering="crispEdges"
        style={{ overflow: "visible", display: "block" }}
      >
        {/* ── ground shadow ── */}
        <ellipse cx="58" cy="177" rx="32" ry="6" fill="rgba(0,0,0,0.22)" />

        {/* ══ STANDING LEG (right, plant foot) ══ */}
        <g id="ace-standing-leg">
          {/* thigh — wide chunky block */}
          <rect x="59" y="120" width="22" height="32" rx="2" fill="var(--wh)" stroke="var(--k)" strokeWidth="3" />
          {/* shin */}
          <rect x="60" y="149" width="20" height="22" rx="2" fill="var(--wh)" stroke="var(--k)" strokeWidth="3" />
          {/* stirrup — thick stripe */}
          <rect x="61" y="158" width="17" height="8" fill="var(--re)" />
          {/* cleat — wide square toe */}
          <rect x="54" y="168" width="32" height="13" rx="3" fill="var(--cl)" stroke="var(--k)" strokeWidth="3" />
          {/* cleats spikes */}
          <rect x="57" y="177" width="7" height="5" rx="1" fill="#333" />
          <rect x="67" y="177" width="7" height="5" rx="1" fill="#333" />
          <rect x="77" y="177" width="5" height="5" rx="1" fill="#333" />
        </g>

        {/* ══ KICK LEG (left, animates on pitch) ══ */}
        <g id="ace-leg-kick">
          <rect x="37" y="120" width="22" height="32" rx="2" fill="var(--wh)" stroke="var(--k)" strokeWidth="3" />
          <rect x="38" y="149" width="20" height="22" rx="2" fill="var(--wh)" stroke="var(--k)" strokeWidth="3" />
          <rect x="39" y="158" width="17" height="8" fill="var(--re)" />
          <rect x="32" y="168" width="32" height="13" rx="3" fill="var(--cl)" stroke="var(--k)" strokeWidth="3" />
          <rect x="35" y="177" width="5" height="5" rx="1" fill="#333" />
          <rect x="43" y="177" width="7" height="5" rx="1" fill="#333" />
          <rect x="53" y="177" width="7" height="5" rx="1" fill="#333" />
        </g>

        {/* ══ BODY GROUP ══ */}
        <g id="ace-body">

          {/* ── GLOVE ARM (left / non-throwing) ── */}
          <g id="ace-glove-arm">
            {/* upper arm — chunky, 20px wide */}
            <rect x="2" y="68" width="20" height="28" rx="5" fill="var(--nv)" stroke="var(--k)" strokeWidth="3" />
            {/* forearm */}
            <rect x="0" y="93" width="18" height="22" rx="5" fill="var(--nv)" stroke="var(--k)" strokeWidth="3" />
            {/* glove — big chunky mitt */}
            <rect x="-4" y="112" width="26" height="22" rx="6" fill="var(--gl)" stroke="var(--k)" strokeWidth="3" />
            {/* glove pocket */}
            <rect x="-1" y="116" width="20" height="16" rx="4" fill="var(--gld)" />
            {/* finger lumps on top of glove */}
            <rect x="-4" y="108" width="7" height="8" rx="2" fill="var(--gl)" stroke="var(--k)" strokeWidth="2.5" />
            <rect x="4"  y="107" width="7" height="8" rx="2" fill="var(--gl)" stroke="var(--k)" strokeWidth="2.5" />
            <rect x="12" y="108" width="7" height="8" rx="2" fill="var(--gl)" stroke="var(--k)" strokeWidth="2.5" />
            {/* webbing line */}
            <path d="M-1,116 Q9,112 20,116" stroke="var(--k)" strokeWidth="2" fill="none" />
          </g>

          {/* ── THROWING ARM (right) ── */}
          <g id="ace-throwing-arm">
            {/* upper arm */}
            <rect x="96" y="68" width="20" height="28" rx="5" fill="var(--nv)" stroke="var(--k)" strokeWidth="3" />
            {/* forearm */}
            <rect x="100" y="93" width="18" height="22" rx="5" fill="var(--nm)" stroke="var(--k)" strokeWidth="3" />
            {/* hand */}
            <circle cx="112" cy="122" r="11" fill="var(--sk)" stroke="var(--k)" strokeWidth="3" />
            {/* baseball */}
            <circle cx="112" cy="122" r="8" fill="var(--wh)" stroke="var(--k)" strokeWidth="2" />
            {/* laces */}
            <path d="M107,119 Q109,116 111,119" stroke="var(--re)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M113,124 Q115,127 117,124" stroke="var(--re)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>

          {/* ── BAT (only visible in batting stance) ── */}
          <g id="ace-bat">
            {/* handle */}
            <rect x="106" y="20" width="9" height="52" rx="3" fill="#8b4513" stroke="var(--k)" strokeWidth="2.5" />
            {/* barrel */}
            <rect x="102" y="8" width="17" height="20" rx="5" fill="#a0522d" stroke="var(--k)" strokeWidth="2.5" />
            {/* grip tape */}
            <rect x="107" y="54" width="7" height="6" rx="1" fill="#2a2a2a" />
            <rect x="107" y="62" width="7" height="4" rx="1" fill="#2a2a2a" />
          </g>

          {/* ── TORSO / JERSEY — WIDE barrel chest ── */}
          {/* main body: 84px wide at shoulders, SNES-style boxy */}
          <polygon points="14,66 104,66 100,120 18,120"
            fill="var(--nv)" stroke="var(--k)" strokeWidth="3" />
          {/* chest mid panel */}
          <polygon points="26,68 90,68 86,112 32,112"
            fill="var(--nm)" />
          {/* jersey pinstripe — classic look */}
          <line x1="58" y1="72" x2="56" y2="112" stroke="var(--wh)" strokeWidth="1.5" opacity="0.2" />
          {/* V-neck collar — wide */}
          <polygon points="44,66 58,86 72,66"
            fill="var(--wh)" stroke="var(--k)" strokeWidth="2.5" />
          <polygon points="47,66 58,80 69,66" fill="var(--wh)" />

          {/* ── BELT ── */}
          <rect x="18" y="116" width="82" height="10" rx="2"
            fill="var(--re)" stroke="var(--k)" strokeWidth="2.5" />
          <rect x="50" y="117" width="18" height="8" rx="2"
            fill="var(--au)" stroke="var(--k)" strokeWidth="1.5" />
          <rect x="54" y="119" width="10" height="4" rx="1" fill="var(--k)" opacity="0.25" />

          {/* ══ HEAD GROUP ══ */}
          <g id="ace-head">
            {/* neck — thick and short */}
            <rect x="44" y="58" width="28" height="14" rx="6"
              fill="var(--sk)" stroke="var(--k)" strokeWidth="2.5" />

            {/* face — BIG round head, SNES proportion */}
            <ellipse cx="58" cy="35" rx="26" ry="30"
              fill="var(--sk)" stroke="var(--k)" strokeWidth="3" />

            {/* jaw / chin depth */}
            <ellipse cx="58" cy="52" rx="20" ry="14" fill="var(--skd)" opacity="0.25" />

            {/* ear — visible on right side */}
            <ellipse cx="84" cy="35" rx="6" ry="9"
              fill="var(--sk)" stroke="var(--k)" strokeWidth="2.5" />
            <ellipse cx="84" cy="35" rx="3" ry="5.5" fill="var(--skd)" opacity="0.5" />

            {/* eyebrows — thick pixel brows, slightly angled = determined look */}
            <rect x="37" y="18" width="16" height="5" rx="2"
              fill="var(--k)" transform="rotate(-4,45,20)" />
            <rect x="57" y="18" width="16" height="5" rx="2"
              fill="var(--k)" transform="rotate(4,65,20)" />

            {/* eyes — 12×12 chunky pixel blocks */}
            <rect x="37" y="24" width="14" height="14" rx="2" fill="var(--k)" />
            <rect x="57" y="24" width="14" height="14" rx="2" fill="var(--k)" />
            {/* pupils + shine */}
            <rect x="43" y="27" width="5" height="5" rx="1" fill="var(--nm)" />
            <rect x="63" y="27" width="5" height="5" rx="1" fill="var(--nm)" />
            <rect x="38" y="25" width="4" height="4" rx="1" fill="var(--wh)" />
            <rect x="58" y="25" width="4" height="4" rx="1" fill="var(--wh)" />

            {/* nose — small inset shadow */}
            <rect x="55" y="43" width="7" height="6" rx="2" fill="var(--skd)" opacity="0.7" />

            {/* mouth — determined straight, slight uptick on right */}
            <path d="M42,54 L70,54" stroke="var(--k)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M66,54 Q70,54 72,51" stroke="var(--k)" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* ── CAP ── */}
            <g id="ace-cap">
              {/* dome — big round SNES cap */}
              <ellipse cx="57" cy="18" rx="28" ry="22"
                fill="var(--nv)" stroke="var(--k)" strokeWidth="3" />
              {/* dome base flattener */}
              <rect x="28" y="26" width="58" height="16" fill="var(--nv)" />
              {/* base band line */}
              <line x1="28" y1="42" x2="86" y2="42" stroke="var(--k)" strokeWidth="3" />
              {/* crown seam */}
              <line x1="57" y1="-2" x2="57" y2="30" stroke="var(--nm)" strokeWidth="2" />
              {/* button */}
              <circle cx="57" cy="0" r="5.5" fill="var(--re)" stroke="var(--k)" strokeWidth="2.5" />
              {/* brim — chunky, extends LEFT, slight downward angle */}
              <polygon points="28,38 44,30 48,42 10,42 8,52 32,52"
                fill="var(--nv)" stroke="var(--k)" strokeWidth="3" />
              {/* brim underside shading */}
              <polygon points="32,42 48,42 46,52 30,52" fill="var(--nm)" opacity="0.7" />
              {/* brim stitching detail */}
              <line x1="12" y1="46" x2="44" y2="44" stroke="var(--nm)" strokeWidth="1.5" opacity="0.6" />
            </g>
          </g>

        </g>{/* end #ace-body */}
      </svg>
    </div>
  );
}
