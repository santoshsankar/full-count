const LABELS = ["A", "B", "C", "D"];

export default function AnswerChoices({ choices, selected, revealed, correctId, onSelect }) {
  return (
    <div className="answer-choices">
      {choices.map((choice, i) => {
        let state = "";
        if (revealed) {
          if (choice.id === correctId)  state = "correct";
          else if (choice.id === selected) state = "wrong";
          else                           state = "dim";
        } else if (choice.id === selected) {
          state = "selected";
        }

        return (
          <button
            key={choice.id}
            className={`choice-btn choice-btn--${state}`}
            onClick={() => !revealed && !selected && onSelect(choice.id)}
            disabled={!!selected}
            aria-label={`Choice ${LABELS[i]}: ${choice.text}`}
          >
            <span className="choice-label">{LABELS[i]}</span>
            <span className="choice-text">{choice.text}</span>
          </button>
        );
      })}
    </div>
  );
}
