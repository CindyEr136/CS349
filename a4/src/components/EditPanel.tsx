import { useRef } from "preact/hooks";
import * as State from "../state";

type EditPanelProps = {
  id: number | null;
  question: string;
  answer: string;
  other1: string;
  other2: string;
};

export default function EditPanel({
  id,
  question,
  answer,
  other1,
  other2,
}: EditPanelProps) {
  const qRef = useRef<HTMLInputElement>(null);
  const aRef = useRef<HTMLInputElement>(null);
  const o1Ref = useRef<HTMLInputElement>(null);
  const o2Ref = useRef<HTMLInputElement>(null);

  function handleSave(e: Event) {
    e.preventDefault();

    const qValue = qRef.current?.value;
    const aValue = aRef.current?.value;
    const o1Value = o1Ref.current?.value;
    const o2Value = o2Ref.current?.value;

    if (!id || !qValue || !aValue || !o1Value || !o2Value) return;

    State.updateQuestion(id, {
      q: qValue,
      a: aValue,
      o1: o1Value,
      o2: o2Value,
    });
    State.edit.value = false;
  }

  return (
    <div class="bg-black bg-opacity-50 fixed top-0 z-50 left-0 flex justify-center items-center w-screen h-screen p-[60px]">
      <div class="bg-gray-100 border border-black flex flex-col flex-1 gap-[10px] p-[30px]">
        <div class="flex gap-[10px]">
          {/* left */}
          <div class="flex flex-col items-end gap-[20px] basis-1/4">
            <span>Question</span>
            <span>Answer</span>
            <span>Other 1</span>
            <span>Other 2</span>
          </div>
          {/* right */}
          <div class="flex flex-col gap-[10px] basis-3/4">
            <input
              type="text"
              ref={qRef}
              defaultValue={question}
              class="border border-black p-[3px]"
            />
            <input
              type="text"
              ref={aRef}
              defaultValue={answer}
              class="border border-black p-[3px]"
            />
            <input
              type="text"
              ref={o1Ref}
              defaultValue={other1}
              class="border border-black p-[3px]"
            />
            <input
              type="text"
              ref={o2Ref}
              defaultValue={other2}
              class="border border-black p-[3px]"
            />
          </div>
        </div>
        <div class="flex flex-1 justify-end gap-[10px]">
          <button onClick={handleSave}>Save</button>
          <button
            onClick={() => {
              State.edit.value = false;
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
