// local imports
import { Model } from "../model";
import View from "../view";

import "./modebarview.css";

export class ModeBarView implements View{
  //#region observer pattern

  update(): void {
    let noneSelected = true;
    this.model.allQuestions().forEach((q) => {
      if (q.done) {
        noneSelected = false;
      }
    });
    this.button.disabled = noneSelected;
    if (this.model.mode === "QuizDone") {
      this.text.innerText = "Quiz Done!";
      this.text.style.display = "inline";
      this.undoButton.style.display = "none";
      this.redoButton.style.display = "none";
    } else if (this.model.mode === "Quiz") {
      this.button.innerText = "Exit";
      this.container.id = "quizmode";
      //this.left.appendChild(this.text);
      this.text.innerText = `Question ${this.model.current} of ${this.model.numCheckedQuestions}`;
      this.text.style.display = "inline";
      this.undoButton.style.display = "none";
      this.redoButton.style.display = "none";
    } else {
      this.button.innerText = "Quiz";
      this.container.id = "listmode";
      //this.left.appendChild(this.undoButton);
      //this.left.appendChild(this.redoButton);
      this.text.style.display = "none";
      this.undoButton.style.display = "inline";
      this.redoButton.style.display = "inline";
    }
    this.undoButton.disabled = !this.model.canUndo;
    this.redoButton.disabled = !this.model.canRedo;
  }
  //#endregion
  left = document.createElement("div")
  text = document.createElement("span");
  button = document.createElement("button");
  undoButton = document.createElement("button");
  redoButton = document.createElement("button");

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.id = "quizmode";

    this.left.id = "left";

    this.undoButton.innerText = "Undo";
    this.redoButton.innerText = "Redo";
    this.undoButton.id = "undo";
    this.redoButton.id = "undo";

    this.button.innerText = "?";

    this.button.addEventListener("click", () => {
      if (model.mode === "QuizDone" || model.mode === "Quiz") {
        this.model.mode = "List";
        this.model.current = 1;
      } else if (model.mode === "List") {
        this.model.mode = "Quiz";
      }
    });
    this.undoButton.addEventListener("click", () => {
      model.undo();
    });
    this.redoButton.addEventListener("click", () => {
      model.redo();
    });
    
    this.left.appendChild(this.undoButton);
    this.left.appendChild(this.redoButton);
    this.container.appendChild(this.left);
    this.container.appendChild(this.button);

    this.model.addObserver(this);
  }
}
