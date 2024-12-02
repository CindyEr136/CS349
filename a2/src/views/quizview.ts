import {
  SKContainer,
  Layout,
  SKButton,
  SKLabel,
} from "simplekit/imperative-mode";

// local imports
import { Observer } from "../observer";
import { Model } from "../model";
import { StackColLayout } from "../layouts/stackCol";

export class QuizView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    if (this.model.mode === "QuizDone") {
      this.question.clearChildren();
      this.panel.clearChildren();
      const resultLabel = new SKLabel({
        text: `${/*this.model.correct*/ this.correct} Correct, ${
          this.model.numCheckedQuestions - /*this.model.correct*/ this.correct
        } Incorrect`,
      });
      this.question.addChild(resultLabel);
      this.panel.addChild(this.question);
      return;
    }
    if (
      this.model.selectedQuestions.length === 0 ||
      this.model.current - 1 >= this.model.selectedQuestions.length
    ) {
      return;
    }
    //reset button colours
   this.button1.fill = "lightgrey";
   this.button2.fill = "lightgrey";
   this.button3.fill = "lightgrey";
    const currentQuestion =
      this.model.selectedQuestions[this.model.current - 1];
    if (currentQuestion) {
      const options = this.model.shuffleArray([
        currentQuestion.answer,
        currentQuestion.other1,
        currentQuestion.other2,
      ]);
      this.questionText.text = currentQuestion.question;
      this.button1.text = options[0];
      this.button2.text = options[1];
      this.button3.text = options[2];
      if (this.model.cheat) {
        if (options[0] === currentQuestion.answer)
          this.button1.fill = "lightyellow";
        else if (options[1] === currentQuestion.answer)
          this.button2.fill = "lightyellow";
        else if (options[2] === currentQuestion.answer)
          this.button3.fill = "lightyellow";
      }
    }
  }
  //#endregion

  panel = new SKContainer({
    fill: "white",
    border: "black",
    fillWidth: 1,
    fillHeight: 1,
    layoutMethod: new StackColLayout(),
  });
  buttons = new SKContainer({
    fillWidth: 1,
    padding: 10,
    layoutMethod: new Layout.FillRowLayout({ gap: 20 }),
  });
  question = new SKContainer({
    fillHeight: 1,
    fillWidth: 1,
    layoutMethod: new Layout.CentredLayout(),
  });
  button1 = new SKButton({ fillWidth: 1 });
  button2 = new SKButton({ fillWidth: 1 });
  button3 = new SKButton({ fillWidth: 1 });
  questionText = new SKLabel({ text: "?" });
  correct: number = 0;

  constructor(private model: Model) {
    super();

    this.id = "quiz";
    // setup the view
    this.fill = "whitesmoke";
    this.padding = 30;
    this.fillWidth = 1;
    this.fillHeight = 1;
    this.layoutMethod = new Layout.CentredLayout();

    this.question.addChild(this.questionText);

    this.panel.addChild(this.question);
    this.panel.addChild(this.buttons);

    this.buttons.addChild(this.button1);
    this.buttons.addChild(this.button2);
    this.buttons.addChild(this.button3);

    this.addChild(this.panel);

    this.model.addObserver(this);

    this.model.selectedQuestions = this.model.shuffleArray(
      this.model.allQuestions().filter((q) => q.done)
    );
    console.log(this.model.selectedQuestions);

    const currentQuestion =
      this.model.selectedQuestions[this.model.current - 1]; //should start on the first question
    const options = this.model.shuffleArray([
      currentQuestion.answer,
      currentQuestion.other1,
      currentQuestion.other2,
    ]);
    this.questionText.text = currentQuestion.question;
    this.button1.text = options[0];
    this.button2.text = options[1];
    this.button3.text = options[2];

    // create controller
    this.button1.addEventListener("action", () => {
      this.handleAnswer(this.button1.text);
    });
    this.button2.addEventListener("action", () => {
      this.handleAnswer(this.button2.text);
    });
    this.button3.addEventListener("action", () => {
      this.handleAnswer(this.button3.text);
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
