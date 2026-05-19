import { useState } from "react";

export default function TeamNameScreen({ onComplete }) {
  const [name, setName] = useState("");
  const trimmed = name.trim();
  const canSubmit = trimmed.length >= 2;

  function submit() {
    if (!canSubmit) return;
    onComplete(trimmed);
  }

  function handleKey(e) {
    if (e.key === "Enter") submit();
  }

  return (
    <div className="team-name-screen scanlines crt-vignette">
      <div className="team-name-screen__inner">
        <div className="team-name-screen__eyebrow">WELCOME TO FULL COUNT</div>
        <h1 className="team-name-screen__title">WHAT'S YOUR TEAM CALLED?</h1>

        <input
          type="text"
          className="team-name-screen__input"
          placeholder="E.G. THE CRUSHERS"
          maxLength={20}
          value={name}
          onChange={e => setName(e.target.value.toUpperCase())}
          onKeyDown={handleKey}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
        />

        <button
          type="button"
          className={`team-name-screen__cta px-box ${!canSubmit ? "team-name-screen__cta--disabled" : ""}`}
          disabled={!canSubmit}
          onClick={submit}
        >
          LET'S DRAFT →
        </button>

        <button
          type="button"
          className="team-name-screen__skip"
          onClick={() => onComplete("THE HOME TEAM")}
        >
          Skip — use default name
        </button>
      </div>
    </div>
  );
}
