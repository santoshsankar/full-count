export default function AceSprite({ animation = "idle", size = 120 }) {
  const scale = size / 120;

  return (
    <div
      className={`ace-sprite-wrap ace-anim-${animation}`}
      style={{ width: size, height: Math.round(180 * scale), display: "inline-block" }}
    >
      <style>{`
        :root {
          --ace-outline:  #111111;
          --ace-skin:     #d4956a;
          --ace-skin-shadow: #b8724a;
          --ace-navy:     #0d1f3c;
          --ace-navy-mid: #1a3a5c;
          --ace-white:    #f0ece0;
          --ace-red:      #c41230;
          --ace-cleat:    #222222;
        }

        /* ── IDLE ── */
        .ace-anim-idle #ace-body        { animation: aceIdleShift 3s ease-in-out infinite; transform-origin: 60px 160px; }
        .ace-anim-idle #ace-glove-arm   { animation: aceGloveTap 3s ease-in-out infinite; transform-origin: 32px 108px; }
        .ace-anim-idle #ace-head        { animation: aceHeadIdle 4s ease-in-out infinite; transform-origin: 60px 52px; }

        @keyframes aceIdleShift {
          0%,100% { transform: translateX(0px); }
          40%     { transform: translateX(-2px); }
          70%     { transform: translateX(2px); }
        }
        @keyframes aceGloveTap {
          0%,75%,100% { transform: translateY(0); }
          85%          { transform: translateY(4px); }
          92%          { transform: translateY(2px); }
        }
        @keyframes aceHeadIdle {
          0%,100% { transform: rotate(0deg); }
          50%     { transform: rotate(-2deg); }
        }

        /* ── PITCH ── */
        .ace-anim-pitch #ace-body         { animation: acePitchBody 1.2s ease-in-out forwards; transform-origin: 60px 160px; }
        .ace-anim-pitch #ace-throwing-arm { animation: acePitchArm 1.2s ease-in-out forwards; transform-origin: 84px 96px; }
        .ace-anim-pitch #ace-leg-kick     { animation: aceLegKick 1.2s ease-in-out forwards; transform-origin: 50px 130px; }
        .ace-anim-pitch #ace-head         { animation: acePitchHead 1.2s ease-in-out forwards; transform-origin: 60px 52px; }
        .ace-anim-pitch #ace-glove-arm    { animation: acePitchGlove 1.2s ease-in-out forwards; transform-origin: 36px 102px; }

        @keyframes acePitchBody {
          0%   { transform: rotate(0deg) translateX(0); }
          20%  { transform: rotate(-6deg) translateX(-3px); }
          55%  { transform: rotate(-10deg) translateX(-5px); }
          75%  { transform: rotate(8deg) translateX(5px); }
          90%  { transform: rotate(3deg) translateX(2px); }
          100% { transform: rotate(0deg) translateX(0); }
        }
        @keyframes acePitchArm {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-30deg); }
          60%  { transform: rotate(-60deg); }
          78%  { transform: rotate(40deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes aceLegKick {
          0%   { transform: rotate(0deg) translateY(0); opacity: 1; }
          15%  { transform: rotate(-10deg) translateY(-5px); }
          50%  { transform: rotate(-65deg) translateY(-30px); }
          80%  { transform: rotate(-5deg) translateY(-2px); }
          100% { transform: rotate(0deg) translateY(0); opacity: 1; }
        }
        @keyframes acePitchHead {
          0%   { transform: rotate(0deg); }
          50%  { transform: rotate(-8deg); }
          80%  { transform: rotate(6deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes acePitchGlove {
          0%   { transform: rotate(0deg) translateY(0); }
          40%  { transform: rotate(20deg) translateY(-8px); }
          75%  { transform: rotate(-15deg) translateY(5px); }
          100% { transform: rotate(0deg) translateY(0); }
        }

        /* ── BAT ── */
        .ace-anim-bat #ace-body         { animation: aceBatCrouch 2s ease-in-out infinite; transform-origin: 60px 155px; }
        .ace-anim-bat #ace-throwing-arm { animation: aceBatArm 2s ease-in-out infinite; transform-origin: 84px 96px; }
        .ace-anim-bat #ace-glove-arm    { animation: aceBatGlove 2s ease-in-out infinite; transform-origin: 36px 96px; }
        .ace-anim-bat #ace-head         { animation: aceBatHead 2s ease-in-out infinite; transform-origin: 60px 52px; }

        @keyframes aceBatCrouch {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%     { transform: translateY(2px) rotate(2deg); }
        }
        @keyframes aceBatArm {
          0%,100% { transform: rotate(-3deg); }
          50%     { transform: rotate(3deg); }
        }
        @keyframes aceBatGlove {
          0%,100% { transform: rotate(2deg); }
          50%     { transform: rotate(-2deg); }
        }
        @keyframes aceBatHead {
          0%,100% { transform: rotate(2deg); }
          50%     { transform: rotate(-1deg); }
        }
      `}</style>

      <svg
        viewBox="0 0 120 180"
        width={size}
        height={Math.round(180 * scale)}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="The Ace — fictional pitcher mascot"
        style={{ overflow: "visible" }}
      >
        {/* Ground shadow */}
        <ellipse cx="60" cy="174" rx="30" ry="5" fill="rgba(0,0,0,0.22)" />

        {/* ══ STANDING LEG (right leg — plant leg) ══ */}
        <g id="ace-standing-leg">
          {/* Thigh */}
          <rect x="57" y="124" width="18" height="26" rx="3"
            fill="var(--ace-white)" stroke="var(--ace-outline)" strokeWidth="3" />
          {/* Shin / lower leg */}
          <rect x="58" y="146" width="16" height="20" rx="2"
            fill="var(--ace-white)" stroke="var(--ace-outline)" strokeWidth="3" />
          {/* Red stirrup stripe */}
          <rect x="59" y="154" width="14" height="5" rx="1" fill="var(--ace-red)" />
          {/* Cleat */}
          <rect x="54" y="162" width="24" height="9" rx="3"
            fill="var(--ace-cleat)" stroke="var(--ace-outline)" strokeWidth="2.5" />
          <rect x="54" y="168" width="6" height="4" rx="1" fill="#444" />
          <rect x="63" y="168" width="6" height="4" rx="1" fill="#444" />
          <rect x="72" y="168" width="5" height="4" rx="1" fill="#444" />
        </g>

        {/* ══ KICK LEG (left leg — animates on pitch) ══ */}
        <g id="ace-leg-kick">
          {/* Thigh */}
          <rect x="44" y="124" width="18" height="26" rx="3"
            fill="var(--ace-white)" stroke="var(--ace-outline)" strokeWidth="3" />
          {/* Shin */}
          <rect x="45" y="146" width="16" height="20" rx="2"
            fill="var(--ace-white)" stroke="var(--ace-outline)" strokeWidth="3" />
          {/* Red stirrup */}
          <rect x="46" y="154" width="14" height="5" rx="1" fill="var(--ace-red)" />
          {/* Cleat */}
          <rect x="41" y="162" width="24" height="9" rx="3"
            fill="var(--ace-cleat)" stroke="var(--ace-outline)" strokeWidth="2.5" />
          <rect x="41" y="168" width="5" height="4" rx="1" fill="#444" />
          <rect x="49" y="168" width="6" height="4" rx="1" fill="#444" />
          <rect x="58" y="168" width="5" height="4" rx="1" fill="#444" />
        </g>

        {/* ══ MAIN BODY ══ */}
        <g id="ace-body">

          {/* ── GLOVE ARM (left / non-throwing) ── */}
          <g id="ace-glove-arm">
            {/* Upper arm */}
            <rect x="18" y="88" width="22" height="13" rx="5"
              fill="var(--ace-navy)" stroke="var(--ace-outline)" strokeWidth="3" />
            {/* Forearm */}
            <rect x="10" y="98" width="18" height="12" rx="4"
              fill="var(--ace-navy)" stroke="var(--ace-outline)" strokeWidth="3" />
            {/* Glove — chunky mitt shape */}
            <ellipse cx="9" cy="110" rx="11" ry="9"
              fill="var(--ace-red)" stroke="var(--ace-outline)" strokeWidth="3" />
            <ellipse cx="9" cy="110" rx="7" ry="6" fill="#8b0010" />
            {/* Glove fingers suggestion */}
            <line x1="4" y1="104" x2="2" y2="100" stroke="var(--ace-outline)" strokeWidth="2" />
            <line x1="8" y1="102" x2="7" y2="98"  stroke="var(--ace-outline)" strokeWidth="2" />
            <line x1="13" y1="102" x2="13" y2="98" stroke="var(--ace-outline)" strokeWidth="2" />
          </g>

          {/* ── THROWING ARM (right) ── */}
          <g id="ace-throwing-arm">
            {/* Upper arm */}
            <rect x="80" y="86" width="22" height="14" rx="5"
              fill="var(--ace-navy)" stroke="var(--ace-outline)" strokeWidth="3" />
            {/* Forearm */}
            <rect x="96" y="96" width="18" height="12" rx="4"
              fill="var(--ace-navy-mid)" stroke="var(--ace-outline)" strokeWidth="3" />
            {/* Hand */}
            <circle cx="117" cy="102" r="8"
              fill="var(--ace-skin)" stroke="var(--ace-outline)" strokeWidth="3" />
            {/* Baseball in hand */}
            <circle cx="117" cy="102" r="5"
              fill="var(--ace-white)" stroke="var(--ace-outline)" strokeWidth="1.5" />
            <path d="M113 100 Q115 98 117 100" stroke="var(--ace-red)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M117 103 Q119 105 121 103" stroke="var(--ace-red)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* ── TORSO / JERSEY ── */}
          {/* Shoulder width: 82px wide at top, tapers slightly */}
          <polygon
            points="22,86 98,86 94,132 26,132"
            fill="var(--ace-navy)" stroke="var(--ace-outline)" strokeWidth="3"
          />
          {/* Jersey chest panel — subtle mid tone */}
          <polygon
            points="35,88 85,88 82,118 38,118"
            fill="var(--ace-navy-mid)"
          />
          {/* Collar */}
          <path d="M50,88 Q60,96 70,88" fill="var(--ace-white)"
            stroke="var(--ace-outline)" strokeWidth="2" />
          {/* Belt */}
          <rect x="26" y="126" width="68" height="8" rx="2"
            fill="var(--ace-red)" stroke="var(--ace-outline)" strokeWidth="2.5" />
          {/* Belt buckle */}
          <rect x="55" y="127" width="10" height="6" rx="1"
            fill="#c8a000" stroke="var(--ace-outline)" strokeWidth="1.5" />

          {/* ── HEAD ── */}
          <g id="ace-head">
            {/* Neck */}
            <rect x="52" y="62" width="16" height="12" rx="3"
              fill="var(--ace-skin)" stroke="var(--ace-outline)" strokeWidth="2.5" />

            {/* Face — chunky oval, slightly asymmetric (facing slightly right) */}
            <ellipse cx="61" cy="46" rx="19" ry="21"
              fill="var(--ace-skin)" stroke="var(--ace-outline)" strokeWidth="3" />
            {/* Jaw shadow */}
            <ellipse cx="61" cy="54" rx="14" ry="10" fill="var(--ace-skin-shadow)" opacity="0.35" />

            {/* Eyes — bold pixel dots */}
            <rect x="52" y="40" width="7" height="7" rx="2" fill="var(--ace-outline)" />
            <rect x="64" y="40" width="7" height="7" rx="2" fill="var(--ace-outline)" />
            {/* Eye shine */}
            <rect x="54" y="41" width="2" height="2" rx="0.5" fill="var(--ace-white)" />
            <rect x="66" y="41" width="2" height="2" rx="0.5" fill="var(--ace-white)" />

            {/* Nose — tiny */}
            <rect x="59" y="51" width="4" height="3" rx="1" fill="var(--ace-skin-shadow)" opacity="0.7" />

            {/* Mouth — determined set */}
            <path d="M54 57 L68 57" stroke="var(--ace-outline)" strokeWidth="2.5"
              strokeLinecap="round" />

            {/* ── CAP ── */}
            <g id="ace-cap">
              {/* Cap dome */}
              <ellipse cx="61" cy="30" rx="20" ry="9"
                fill="var(--ace-navy)" stroke="var(--ace-outline)" strokeWidth="3" />
              <rect x="41" y="24" width="40" height="18" rx="9"
                fill="var(--ace-navy)" stroke="var(--ace-outline)" strokeWidth="3" />
              {/* Cap crown seam */}
              <line x1="61" y1="14" x2="61" y2="36"
                stroke="var(--ace-navy-mid)" strokeWidth="1.5" />
              {/* Brim — extends left (facing slightly right) */}
              <path d="M41,38 Q36,42 22,42 Q22,46 28,46 Q44,44 44,40"
                fill="var(--ace-navy)" stroke="var(--ace-outline)" strokeWidth="3" />
              {/* Cap button on top */}
              <circle cx="61" cy="16" r="3"
                fill="var(--ace-red)" stroke="var(--ace-outline)" strokeWidth="2" />
            </g>
          </g>

        </g>{/* end #ace-body */}
      </svg>
    </div>
  );
}
