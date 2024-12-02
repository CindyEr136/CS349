import * as State from "../state";

export default function Quiz() {
  if (State.current.value === 1 && !State.quizStarted.value) {
    State.selected.value = State.shuffleArray(
      State.questions.value.filter((q) => q.done)
    );
    State.quizStarted.value = true;
  }
  let currentQuestion = State.selected.value[State.current.value - 1];

  /*let options = State.shuffleArray([
    currentQuestion.answer,
    currentQuestion.other1,
    currentQuestion.other2,
  ]);*/

  //let options = [currentQuestion.answer, currentQuestion.other1, currentQuestion.other2];
  //let shuffled = State.shuffleArray(options);

  return (
    <div class="flex flex-1 bg-white border border-gray-950 flex-col m-[30px]">
      {State.mode.value === "QuizDone" ? (
        <span class="flex-1 flex justify-center items-center">
          {`${State.correct.value} Correct ${
            State.numDone.value - State.correct.value
          } Incorrect`}{" "}
        </span>
      ) : (
        <>
          <div class="flex-1 flex justify-center items-center">
            <span>{currentQuestion.question}</span>
          </div>
          <div class="flex gap-[20px] p-[10px]">
            {currentQuestion.options.map((option) => (
              <button
                class={`flex-1 ${
                  State.cheat.value && option === currentQuestion.answer
                    ? "bg-yellow-200"
                    : ""
                }`}
                onClick={() => {
                  if (option === currentQuestion.answer) State.correct.value++;
                  if (
                    State.current.value - 1 <
                    State.selected.value.length - 1
                  ) {
                    State.current.value++;
                  } else {
                    State.mode.value = "QuizDone";
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
