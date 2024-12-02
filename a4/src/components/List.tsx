import * as State from "../state";

import Question from "./Question";

export default function List() {
  if (State.mode.value === "Start") {
    State.initialQuestions();
    State.mode.value = "List";
  }

  return (
    <div class="flex-1 flex flex-col border border-gray-500">
      <div class="p-[10px] flex gap-[10px] border border-b-gray-500">
        {/* toolbar */}
        <button
          class="min-w-[80px]"
          onClick={() => {
            State.questions.value.map((q) =>
              State.updateQuestion(q.id, { done: true })
            );
          }}
          disabled={State.numDone.value === State.num.value}
        >
          All
        </button>
        <button
          class="min-w-[80px]"
          onClick={() => {
            State.questions.value.map((q) =>
              State.updateQuestion(q.id, { done: false })
            );
          }}
          disabled={State.numDone.value === 0}
        >
          None
        </button>
        <button
          class="min-w-[80px]"
          onClick={() => {
            const checkedQuestions = State.questions.value
              .filter((q) => q.done)
              .map((q) => q.id);
            if (checkedQuestions.length > 0) {
              State.deleteQuestions(checkedQuestions);
            }
          }}
          disabled={State.numDone.value === 0}
        >
          Delete
        </button>
        <button
          class="min-w-[80px]"
          onClick={() => {
            if (State.questions.value.length < 10) State.addQuestion();
          }}
          disabled={State.questions.value.length === 10}
        >
          Add
        </button>
      </div>
      {/* question list */}
      <div class="p-[10px] gap-[10px] flex flex-wrap border border-t-gray-500 border-b-0">
        {State.questions.value.map((q) => (
          <Question question={q} />
        ))}
      </div>
    </div>
  );
}
