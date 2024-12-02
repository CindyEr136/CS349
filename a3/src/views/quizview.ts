import View from "../view";
import { Model } from "../model";

import "./quizview.css";

export class QuizView implements View {
  update(): void {
    if (this.model.mode === "QuizDone") {
      this.panel.replaceChildren();
      this.questionWrapper.replaceChildren();
      this.questionText.innerText = `${this.correct} Correct, ${
        this.model.numCheckedQuestions - this.correct
      } Incorrect`;
      this.questionWrapper.appendChild(this.questionText);
      this.panel.appendChild(this.questionWrapper);
      return;
    }
    if (
      this.model.selectedQuestions.length === 0 ||
      this.model.current - 1 >= this.model.selectedQuestions.length
    ) {
      return;
    }
    const currentQuestion =
      this.model.selectedQuestions[this.model.current - 1];
    if (currentQuestion) {
      const options = this.model.shuffleArray([
        currentQuestion.answer,
        currentQuestion.other1,
        currentQuestion.other2,
      ]);
      this.questionText.innerText = currentQuestion.question;
      this.button1.innerText = options[0];
      this.button2.innerText = options[1];
      this.button3.innerText = options[2];

      //reset buttons
      this.button1.id = "reg";
      this.button2.id = "reg";
      this.button3.id = "reg";

      //highlight correct button
      if (this.model.cheat) {
        if (options[0] === currentQuestion.answer) {
            this.button1.id = "cheat";
        } else if (options[1] === currentQuestion.answer) {
            this.button2.id = "cheat";
        } else if (options[2] === currentQuestion.answer) {
            this.button3.id = "cheat";
        }
      }
    }
  }

  private container: HTMLDivElement;
  get root() {
    return this.container;
  }

  panel = document.createElement("div");
  buttons = document.createElement("div");
  questionWrapper = document.createElement("div");
  questionText = document.createElement("span");
  button1 = document.createElement("button");
  button2 = document.createElement("button");
  button3 = document.createElement("button");
  correct: number = 0;

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.id = "quizview";

    this.buttons.appendChild(this.button1);
    this.buttons.appendChild(this.button2);
    this.buttons.appendChild(this.button3);
    this.button1.id = "reg";
    this.button2.id = "reg";
    this.button3.id = "reg";
    this.buttons.id = "buttons";

    this.questionWrapper.appendChild(this.questionText);
    this.questionWrapper.id = "questionWrapper";

    this.panel.appendChild(this.questionWrapper);
    this.panel.appendChild(this.buttons);
    this.panel.id = "panel";

    this.container.appendChild(this.panel);

    this.model.addObserver(this);

    this.model.selectedQuestions = this.model.shuffleArray(
      this.model.allQuestions().filter((q) => q.done)
    );

    this.button1.addEventListener("click", () => {
      this.handleAnswer(this.button1.innerText);
    });
    this.button2.addEventListener("click", () => {
      this.handleAnswer(this.button2.innerText);
    });
    this.button3.addEventListener("click", () => {
      this.handleAnswer(this.button3.innerText);
    });
  }

  private handleAnswer(selectedAnswer: string): void {
    if (
      selectedAnswer ===
      this.model.selectedQuestions[this.model.current - 1].answer
    ) {
      this.correct++;
    }
    this.moveToNext();
  }

  private moveToNext(): void {
    if (this.model.current - 1 < this.model.selectedQuestions.length - 1) {
      this.model.current++;
    } else {
      this.model.mode = "QuizDone";
    }
  }
}
