import { useEffect, useRef, useState } from "react";

function OdometerDigit({ digit, delay }) {
  return (
    <span
      className="odometer-digit"
      style={{ animationDelay: `${delay}ms` }}
    >
      {digit}
    </span>
  );
}

export default function IQDisplay({ iq, flash }) {
  const [displayed, setDisplayed] = useState(iq);
  const [rolling, setRolling] = useState(false);
  const prevRef = useRef(iq);

  useEffect(() => {
    if (iq !== prevRef.current) {
      setRolling(true);
      const t = setTimeout(() => {
        setDisplayed(iq);
        setRolling(false);
        prevRef.current = iq;
      }, 400);
      return () => clearTimeout(t);
    }
  }, [iq]);

  const digits = String(displayed).split("");
  const delays = digits.length === 3
    ? [200, 100, 0]
    : digits.length === 2
      ? [100, 0]
      : [0];

  return (
    <div className={`iq-display ${flash === "pos" ? "iq-flash-pos" : flash === "neg" ? "iq-flash-neg" : ""}`}>
      <span className="iq-display-label">IQ</span>
      <div className={`iq-digits ${rolling ? "iq-rolling" : ""}`}>
        {digits.map((d, i) => (
          <OdometerDigit key={`${i}-${d}-${rolling}`} digit={d} delay={delays[i] || 0} />
        ))}
      </div>
    </div>
  );
}
