import * as State from "../state";

export default function ModeBar() {
  return (
    <div
      class={`w-screen p-[10px] flex ${
        State.mode.value === "List" ? "bg-gray-300" : "bg-blue-200"
      }`}
    >
      <div class="w-screen flex gap-[10px]">
        {State.mode.value === "List" ? (
          <>
            <button
              class="min-w-[80px]"
              onClick={State.undo}
              disabled={!State.canUndo.value}
            >
              Undo
            </button>
            <button
              class="min-w-[80px]"
              onClick={State.redo}
              disabled={!State.canRedo.value}
            >
              Redo
            </button>
          </>
        ) : (
          <span>
            {State.mode.value === "QuizDone"
              ? "Quiz Completed"
              : `Question ${State.current.value} of ${State.numDone.value}`}
          </span>
        )}
      </div>
      <button
        class="min-w-[100px]"
        onClick={() => {
          if (State.mode.value === "Quiz" || State.mode.value === "QuizDone") {
            State.mode.value = "List";
            State.current.value = 1;
            State.correct.value = 0;
          } else if (State.mode.value === "List") {
            State.mode.value = "Quiz";
          }
        }}
        disabled={State.numDone.value === 0}
      >
        {State.mode.value === "Quiz" || State.mode.value === "QuizDone"
          ? "Exit"
          : "Quiz"}
      </button>
    </div>
  );
}
