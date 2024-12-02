import * as State from "../state";

type QuestionProps = {
  question: State.QuestionCard;
};

export default function Question({ question }: QuestionProps) {
  return (
    <div class="bg-blue-200 flex gap-[8px] p-[8px]">
      <input
        class=""
        type="checkbox"
        checked={question.done}
        onInput={() =>
          State.updateQuestion(question.id, { done: !question.done })
        }
      />
      <span
        class="font-sans text-sm/[10pt]"
        onDblClick={() => {
          State.edit.value = true;
          State.selectedID.value = question.id;
        }}
      >
        {question.question}
      </span>
    </div>
  );
}
