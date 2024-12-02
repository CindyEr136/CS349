import List from "./List";
import Quiz from "./Quiz";

import * as State from "../state";

export default function MiddleArea() {
  return (
    <div class="flex w-screen h-screen flex-col bg-white p-[10px]">
      {State.mode.value === "List" || State.mode.value === "Start" ? (
        <List />
      ) : (
        <Quiz />
      )}
    </div>
  );
}
