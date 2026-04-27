import { useEffect, useRef, useState } from "react";

function DigitBox({ value, label }) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      setFlipping(true);
      const t = setTimeout(() => {
        setDisplay(value);
        setFlipping(false);
        prevRef.current = value;
      }, 150);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div className="count-box-wrap">
      <div className={`count-box ${flipping ? "count-box--flip" : ""}`}>
        <span className="count-box-digit">{display}</span>
      </div>
      <span className="count-box-label">{label}</span>
    </div>
  );
}

export default function CountDisplay({ balls, strikes }) {
  return (
    <div className="count-display">
      <DigitBox value={balls}   label="B" />
      <span className="count-sep">·</span>
      <DigitBox value={strikes} label="S" />
    </div>
  );
}
