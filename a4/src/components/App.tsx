import ModeBar from "./ModeBar";
import MiddleArea from "./MiddleArea";
import StatusBar from "./StatusBar";
import EditPanel from "./EditPanel";

import { useRef, useEffect } from "preact/hooks";

// common approach is to import all state functions and properties like this
import * as State from "../state";

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?") {
        State.cheat.value = !State.cheat.value;
      }
    };
    const appDiv = appRef.current;

    if (appDiv) {
      appDiv.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (appDiv) {
        appDiv.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  const editId = State.selectedID.value;
  const selected = editId ? State.getQuestion(editId) : null;
  return (
    <>
      {State.edit.value && selected ? (
        <EditPanel
          id={State.selectedID.value}
          question={selected.question}
          answer={selected.answer}
          other1={selected.other1}
          other2={selected.other2}
        />
      ) : null}
      <div
        ref={appRef}
        tabIndex={0}
        class={`flex w-screen h-screen flex-col outline-none 
          ${State.edit.value ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <ModeBar />
        <MiddleArea />
        <StatusBar />
      </div>
    </>
  );
}
