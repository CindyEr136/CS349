import * as State from "../state";

export default function StatusBar() {
  return (
    <div class="w-screen flex bg-gray-300 p-[10px]">
      {/* question label */}
      <span class="w-screen">
        {`${State.num.value} question${
          State.num.value > 1 || State.num.value === 0 ? "s" : ""
        } ${
          State.numDone.value > 0 ? ` (${State.numDone.value} selected)` : ""
        }`}
      </span>
      {/* cheat label */}
      <span class="">{State.cheat.value ? "CHEATING" : ""}</span>
    </div>
  );
}
