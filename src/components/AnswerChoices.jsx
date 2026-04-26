const CHOICE_LABELS = { a: "A", b: "B", c: "C", d: "D" };

export default function AnswerChoices({ choices, selected, revealed, correctId, onSelect }) {
  return (
    <div className="answer-choices">
      {choices.map((choice) => {
        let state = "default";
        if (selected === choice.id && !revealed) state = "selected";
        if (revealed) {
          if (choice.id === correctId) state = "correct";
          else if (choice.id === selected) state = "wrong";
          else state = "dim";
        }

        return (
          <button
            key={choice.id}
            className={`choice-btn choice-${state}`}
            onClick={() => !revealed && !selected && onSelect(choice.id)}
            disabled={!!revealed || (!!selected && selected !== choice.id)}
            aria-label={`Choice ${CHOICE_LABELS[choice.id]}: ${choice.text}`}
          >
            <span className="choice-label">{CHOICE_LABELS[choice.id]}</span>
            <span className="choice-text">{choice.text}</span>
          </button>
        );
      })}
    </div>
  );
}
