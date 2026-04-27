// 3×3 pitch zone selector

const ZONES = [
  ["up-in",   "up-middle",  "up-away"  ],
  ["mid-in",  "middle",     "mid-away" ],
  ["low-in",  "low-middle", "low-away" ],
];

const ZONE_LABELS = {
  "up-in":   "IN\nHI",
  "up-away": "OUT\nHI",
  "middle":  "HEART",
  "low-in":  "IN\nLO",
  "low-away":"OUT\nLO",
};

export default function PitchZoneGrid({ selected, onSelect, highlightZone, disabled }) {
  return (
    <div className="pitch-zone-wrap">
      <div className="pitch-zone-label">LOCATION</div>
      <div className="pitch-zone-border">
        <div className="pitch-zone-grid">
          {ZONES.map((row, ri) =>
            row.map((zone) => {
              const isSelected  = selected === zone;
              const isHighlight = highlightZone === zone;
              let cls = "zone-cell";
              if (isSelected)  cls += " zone-cell--selected";
              if (isHighlight) cls += " zone-cell--incoming";

              return (
                <button
                  key={zone}
                  className={cls}
                  onClick={() => !disabled && onSelect && onSelect(zone)}
                  disabled={disabled}
                  title={zone}
                >
                  {ZONE_LABELS[zone] && (
                    <span className="zone-cell-label">
                      {ZONE_LABELS[zone]}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
